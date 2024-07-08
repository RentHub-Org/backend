import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { BtfsNodeService } from './btfs-node/btfs-node.service';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import FormData from 'form-data';

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
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const config = {
      method: 'post',
      url: 'http://localhost:5001/api/v1/add?w=true',
      headers: {
        ...formData.getHeaders(),
      },
      data: formData,
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  freeTier(@Req() req:Request){
    return this.btfsService.freeTierUpload(req);
  }
  @Get("/gateway/:id/:cid")
  gateway(@Param("id") id: string, @Param("cid") cid: string ):any{
    //check if the id exist in the db for a user.. and count the free tier for that user....
    this.btfsService.freeTierGet(cid);
  }
}



@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const config = {
      method: 'post',
      url: 'http://localhost:5001/api/v1/add?w=true',
      headers: {
        ...formData.getHeaders(),
      },
      data: formData,
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}