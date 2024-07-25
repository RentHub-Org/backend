import { Body, Controller, Get, Param, Post, Query, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { BtfsNodeService } from './btfs-node/btfs-node.service';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import FormData from 'form-data';
import { Express } from 'express';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly btfsService: BtfsNodeService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Post()
  // postJson(@Body() body: any ):string{
  //   return this.btfsService.addJsonToBtfsNode(JSON.stringify(body));
  // }

  @Post("/testOut")
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.btfsService.freeTierUpload(file);
  }

  @Get("/gateway/:id/:cid")
  async gateway(@Param("id") id: string, @Param("cid") cid: string, @Res() res: Response):Promise<any>{
    const serviceResponse: any = await this.btfsService.freeTierGet(cid)
    Object.keys(serviceResponse.headers).forEach((key) => {
      res.setHeader(key, serviceResponse.headers[key]);
    });
    res.setHeader('Content-Type', serviceResponse.headers['content-type'] || 'application/octet-stream');
    return res.send(serviceResponse.data);
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor('file'))
  async rentalUploadFile(@Query("to-blockchain") to_bc:any,@Query("days") days: number, @UploadedFile() file: Express.Multer.File) {
    if(to_bc == undefined || days == undefined){
      console.log(to_bc, days);
      return "hehe";
    }
    return this.btfsService.remtalUpload(file, to_bc, days);
  }

  @Get("status/:cid")
  uploadStatus(@Param("cid") session_id: string){
    return this.btfsService.uploadStatus(session_id);
  }

}


