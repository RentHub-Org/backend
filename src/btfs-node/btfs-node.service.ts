import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';
import { catchError, firstValueFrom, lastValueFrom, map, of, tap } from 'rxjs';
import { Readable } from 'stream';

// import { ConfigService } from 'src/config/config.service';

@Injectable()
export class BtfsNodeService {
  constructor(
    private readonly httpService: HttpService,
    // private readonly configService: ConfigService,
  ) {}

  async freeTierUpload(file: Express.Multer.File) {
    const molterFilePath = __dirname + '/../../' + file.path;
    console.log('file name btfs-node freties upload: path: ', molterFilePath);
    const stream = fs.createReadStream(molterFilePath);
    const formData = new FormData();

    formData.append('file', stream, file.originalname);

    const headers = {
      ...formData.getHeaders(),
    };
    return firstValueFrom(
      this.httpService
        .post('http://localhost:5001/api/v1/add?', formData, { headers })
        .pipe(
          map((res) => {
            if (res.status == HttpStatus.BAD_REQUEST) {
              throw new HttpException(
                'The file is too large to be uploaded. Please try to upload a smaller file.',
                HttpStatus.BAD_REQUEST,
              );
            } else if (res.status == HttpStatus.OK) {
              return res.data;
            }
          }),
          tap(() => {
            fs.unlinkSync(molterFilePath); // delete the stored file....
          }),
        ),
    );
  }

  async freeTierGet(cid: string): Promise<any> {
    const redirectResponse = await lastValueFrom(
      this.httpService
        .get(`http://localhost:8080/btfs/${cid}`, {
          responseType: 'arraybuffer',
        })
        .pipe(
          catchError((err) => {
            // console.log("error: ",err, err.response, err.response.status);
            if (
              err.response.status === HttpStatus.MOVED_PERMANENTLY &&
              err.response.headers.location
            ) {
              console.log();
              return of(err.response);
            }
            err.response.data = JSON.parse(
              '{"error":"the requested CID is no longer present in the testing environment","status":"404"}',
            );
            err.response.headers['Content-Type'] = 'application/json';
            throw new HttpException(
              err.response.data,
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
          map((res) => {
            if (res.status === HttpStatus.OK) {
              const buffer = Buffer.from(res.data, 'binary');

              // Create a readable stream from the buffer
              // this section is for testing only
              const stream = fs.createWriteStream(
                __dirname + `/../../write/${cid}`,
              );
              stream.write(buffer);
              stream.end();
              //savied image in catche...

              return {
                data: res.data,
                headers: res.headers,
              };
            }
            const err = JSON.parse(
              '{"error":"the requested CID is no longer present in the testing environment","status":"404"}',
            );
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
    );
    return redirectResponse;
  }

  //todo : remove the default days, and add validation
  async remtalUpload(
    file: Express.Multer.File,
    to_bc: any,
    rentForDays: number = 30,
  ) {
    if (to_bc == undefined) {
      to_bc = false;
    }
    const molterFilePath = path.join(__dirname, '..', '..', file.path);
    const stream = fs.createReadStream(molterFilePath);
    const formData = new FormData();

    formData.append('file', stream, file.originalname);

    const headers = {
      ...formData.getHeaders(),
    };
    const nodeAddRes: any = await firstValueFrom(
      this.httpService
        .post(
          `http://localhost:5001/api/v1/add?to-blockchain=${to_bc}`,
          formData,
          { headers },
        )
        .pipe(
          map((res: any) => {
            if (res.status == HttpStatus.BAD_REQUEST) {
              throw new HttpException(
                'The file is too large to be uploaded. Please try to upload a smaller file.',
                HttpStatus.BAD_REQUEST,
              );
            } else if (res.status == HttpStatus.OK) {
              return res.data;
            }
            //failed req for adding to node...
            throw new HttpException(
              'unexpected error in adding to node.',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
          tap(() => {
            fs.unlinkSync(molterFilePath); // delete the stored file....
          }),
        ),
    );
    //adding is  done now trying to upload...
    //put a validation on rentForDays to be greater than 30......
    if (rentForDays < 30) {
      throw new HttpException(
        'The minimum rental period is 30 days.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const response = await lastValueFrom(
      this.httpService
        .post(
          `http://localhost:5001/api/v1/storage/upload?arg=${nodeAddRes.Hash}&len=${rentForDays}`,
          null,
        )
        .pipe(
          catchError((err) => {
            //todo: save error for future refrence...
            console.error(err);
            this.httpService.post(
              `http://localhost:5001/api/v1/files/rm?arg=${nodeAddRes.Hash}`,
              {},
            );
            throw new HttpException(
              'Error while uploding the file.... retry later',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
          map((res: any) => {
            return res.data;
          }),
        ),
    );
    const fileContext = {
      days: rentForDays,
      ...nodeAddRes,
      sessionId: response.ID,
    };
    return fileContext;
  }

  //service to upload a json file to the node...
  async freeTierUploadJSON(json: any) {
    const formData = new FormData();
    const stream = Readable.from([JSON.stringify(json)]);

    formData.append('file', stream, new Date().toISOString() + '.json');

    const headers = {
      ...formData.getHeaders(),
    };
    return firstValueFrom(
      this.httpService
        .post('http://localhost:5001/api/v1/add?', formData, { headers })
        .pipe(
          map((res) => {
            if (res.status == HttpStatus.BAD_REQUEST) {
              throw new HttpException(
                'The file is too large to be uploaded. Please try to upload a smaller file.',
                HttpStatus.BAD_REQUEST,
              );
            } else if (res.status == HttpStatus.OK) {
              return res.data;
            }
          }),
        ),
    );
  }

  async UploadJSON(json: any, to_bc: any, rentForDays: number = 30) {
    if (to_bc == undefined) {
      to_bc = false;
    }
    const stream = Readable.from([JSON.stringify(json)]);
    const formData = new FormData();

    formData.append('file', stream, new Date().toISOString() + '.json');

    const headers = {
      ...formData.getHeaders(),
    };
    const nodeAddRes: any = await firstValueFrom(
      this.httpService
        .post(
          `http://localhost:5001/api/v1/add?to-blockchain=${to_bc}`,
          formData,
          { headers },
        )
        .pipe(
          map((res: any) => {
            if (res.status == HttpStatus.BAD_REQUEST) {
              throw new HttpException(
                'The file is too large to be uploaded. Please try to upload a smaller file.',
                HttpStatus.BAD_REQUEST,
              );
            } else if (res.status == HttpStatus.OK) {
              return res.data;
            }
            //failed req for adding to node...
            throw new HttpException(
              'unexpected error in adding to node.',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
    );
    //adding is  done now trying to upload...
    //put a validation on rentForDays to be greater than 30......
    if (rentForDays < 30) {
      throw new HttpException(
        'The minimum rental period is 30 days.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const response = await lastValueFrom(
      this.httpService
        .post(
          `http://localhost:5001/api/v1/storage/upload?arg=${nodeAddRes.Hash}&len=${rentForDays}`,
          null,
        )
        .pipe(
          catchError((err) => {
            //todo: save error for future refrence...
            console.error(err);
            this.httpService.post(
              `http://localhost:5001/api/v1/files/rm?arg=${nodeAddRes.Hash}`,
              null,
            );
            throw new HttpException(
              'Error while uploding the file.... retry later',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
          map((res: any) => {
            return res.data;
          }),
        ),
    );
    const fileContext = {
      days: rentForDays,
      ...nodeAddRes,
      sessionId: response.ID,
    };
    return fileContext;
  }

  async uploadStatus(session_id: string) {
    console.log(session_id);
    const formData = new FormData();
    formData.append('session-id', session_id);
    const headers = {
      ...formData.getHeaders(),
    };
    return await lastValueFrom(
      this.httpService
        .post(`http://localhost:5001/api/v1/storage/upload/status`, formData, {
          ...headers,
        })
        .pipe(
          map((res: any) => {
            return res.data;
          }),
        ),
    );
  }

  //status  route.. here....
  // http://127.0.0.1:5001/api/v1/storage/upload/status?
}
