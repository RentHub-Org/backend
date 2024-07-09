import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom, lastValueFrom, map, of, tap } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import * as FormData from 'form-data';
import { Readable } from 'stream';
// import { ConfigService } from 'src/config/config.service';

@Injectable()
export class BtfsNodeService {

  constructor(
    private readonly httpService: HttpService,
    // private readonly configService: ConfigService,
  
  ){}

  addBinaryToBtfsNode(){

  }

  addJsonToBtfsNode(jsonData: string){
    // var data = new FormData();
    // data.append('file', jsonData);
    // const response = this.httpService.post("http://localhost:5001/api/v1"+"/add",{
    //   headers: { 
    //   ...data.getHeaders()
    //   },
    //   data : data
    // })
    // console.log(response);
    // return "added";

  }
  pinTOBtfs(){}

  async freeTierUpload(file: Express.Multer.File){
    const molterFilePath = __dirname + "\\..\\..\\" + file.path;
    const stream = fs.createReadStream(molterFilePath);
    console.log(stream);
    const formData = new FormData();

    formData.append('file', stream, file.originalname);

    const headers = {
      ...formData.getHeaders(),
    };
    return firstValueFrom(
      this.httpService.post('http://localhost:5001/api/v1/add?w=true', formData,{ headers }).pipe(
        map((res) => {
          if(res.status == HttpStatus.BAD_REQUEST){
            throw new HttpException("The file is too large to be uploaded. Please try to upload a smaller file.", HttpStatus.BAD_REQUEST)
          }
          else if(res.status == HttpStatus.OK){
            return res.data;
          }
        }),
        tap(()=>{
          fs.unlinkSync(molterFilePath); // delete the stored file....
        })
      )
    );
  }

  async freeTierGet(cid: string):Promise<any>{
    const redirectResponse = await lastValueFrom( this.httpService.get(`http://localhost:8080/btfs/${cid}`, { maxRedirects: 0 }).pipe(
      catchError((err) => {
        // console.log("error: ",err, err.response, err.response.status);
        console.log(err);
        if (err.response.status === HttpStatus.MOVED_PERMANENTLY && err.response.headers.location) {
          return of(err.response);
        }
        err.response.data = '{"error":"the requested CID is no longer present in the testing environment","status":"404"}';
        err.response.headers['Content-Type'] = 'application/json';
        throw new HttpException(err.response.data, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    ));
    fs.writeFile(__dirname + "/../../write/file.png", redirectResponse.data, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('File written successfully!');
      }
    });
    // console.log(redirectResponse.headers, redirectResponse.data[1]);
    return redirectResponse;
  }
}
