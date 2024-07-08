import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
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

  freeTierUpload(req: Request){
    
  }

  freeTierGet(cid: string):any{
    return firstValueFrom( this.httpService.post("http:localhost:8080/btfs/"+cid).pipe(
      map((res) => {
        if(res.status == HttpStatus.BAD_REQUEST){
          throw new HttpException("The request cid now no longer present in the testing env. Either update to a higher tier or redeploy the file.", HttpStatus.NOT_FOUND)
        }
        else if(res.status == HttpStatus.OK){
          return res;
        }
      })
    ));
  }
}
