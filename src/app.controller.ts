import { Body, Controller, Get, HttpException, Param, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { BtfsNodeService } from './btfs-node/btfs-node.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Response } from 'express';
import { QuotaValidatorGuard } from './guards/quataValidator';
import { CheckTronSigGuard } from './guards/tronSignatureValidator';
import { DeductCreditsInterceptor } from './intercepters/CreditDeductionIntercepter';
import { FileReciptCreaterDevInterceptor } from './intercepters/FileReciptCreaterDevInterceptor';
import { FileReciptCreaterRentalInterceptor } from "./intercepters/FileReciptCreaterRentalIntercepter";
import { ApiKeyValidatorGuard } from './guards/apiKeyVerifyer';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly btfsService: BtfsNodeService
  ) {}

  // TESTING - route
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/testOut")
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.btfsService.freeTierUpload(file);
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








  // PROD - route
  @Post("/tronSig/testout")
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(QuotaValidatorGuard) // this is to be removed because this is a fre tirrre uploding.
  @UseGuards(CheckTronSigGuard)
  @UseInterceptors(DeductCreditsInterceptor, FileReciptCreaterDevInterceptor)
  async uploadCheckFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const returnDataFreeTier = await this.btfsService.freeTierUpload(file);
    console.log(returnDataFreeTier);
    //setting context for post request processes...
    req.file_hash = returnDataFreeTier.Hash;
    req.file_size = returnDataFreeTier.Size;
    req.file_name = returnDataFreeTier.Name;
    return returnDataFreeTier;    
  }

  @Post("tronSig/upload")
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(QuotaValidatorGuard)
  @UseGuards(CheckTronSigGuard)
  @UseInterceptors(DeductCreditsInterceptor, FileReciptCreaterRentalInterceptor)
  async rentalUploadFileViaSig(@Query("to-blockchain") to_bc:any,@Query("days") days: number, @UploadedFile() file: Express.Multer.File, @Req() req:any) {
    if(to_bc == undefined || days == undefined){
      console.log(to_bc, days);
      return "hehe";
    }
    const data = await this.btfsService.remtalUpload(file, to_bc, days);
    console.log("data💜💜: ",data);
    req.Hash = data.Hash;
    req.days = data.days;
    req.sessionId = data.sessionId;
    req.Size = data.Size;
    req.Name = data.Name;
    return data;
  }

  // PROD - SDK
  @Post("/sdk/dev")
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(QuotaValidatorGuard) // this is to be removed because this is a fre tier uploding.
  @UseGuards(ApiKeyValidatorGuard) // guard that finds the user in the context.
  @UseInterceptors(DeductCreditsInterceptor, FileReciptCreaterDevInterceptor)
  async uploadCheckFileSDK(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const returnDataFreeTier = await this.btfsService.freeTierUpload(file);
    console.log(returnDataFreeTier);
    //setting context for post request processes...
    req.file_hash = returnDataFreeTier.Hash;
    req.file_size = returnDataFreeTier.Size;
    req.file_name = returnDataFreeTier.Name;
    return returnDataFreeTier;    
  }

  @Post("/sdk/dev/pinJson")
  @UseGuards(QuotaValidatorGuard) // this is to be removed because this is a fre tier uploding.
  @UseGuards(ApiKeyValidatorGuard) // guard that finds the user in the context.
  @UseInterceptors(DeductCreditsInterceptor, FileReciptCreaterDevInterceptor)
  async uploadJsonViaSdk(@Body('json') json: any, @Req() req) {
    const returnDataFreeTier = await this.btfsService.freeTierUploadJSON(json);
    console.log(returnDataFreeTier);
    //setting context for post request processes...
    req.file_hash = returnDataFreeTier.Hash;
    req.file_size = returnDataFreeTier.Size;
    req.file_name = returnDataFreeTier.Name;
    return returnDataFreeTier;    
  }

  @Post("sdk/rental")
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(QuotaValidatorGuard)
  @UseGuards(ApiKeyValidatorGuard)
  @UseInterceptors(DeductCreditsInterceptor, FileReciptCreaterRentalInterceptor)
  async rentalUploadFileViaSDK(@Query("to-blockchain") to_bc:any,@Query("days") days: number, @UploadedFile() file: Express.Multer.File, @Req() req:any) {
    if(to_bc == undefined || days == undefined){
      console.log(to_bc, days);
      return "to_bc or days not found for rental upload.";
    }
    const data = await this.btfsService.remtalUpload(file, to_bc, days);
    console.log("data💜💜: ",data);
    req.Hash = data.Hash;
    req.days = data.days;
    req.sessionId = data.sessionId;
    req.Size = data.Size;
    req.Name = data.Name;
    return data;
  }

  @Post("/sdk/rental/pinJson")
  @UseGuards(QuotaValidatorGuard)
  @UseGuards(ApiKeyValidatorGuard)
  @UseInterceptors(DeductCreditsInterceptor, FileReciptCreaterRentalInterceptor)
  async rentalUploadJsonViaSDK(@Query("to-blockchain") to_bc:any,@Query("days") days: number, @Body("json") json:any, @Req() req:any) {
    if(to_bc == undefined || days == undefined){
      console.log(to_bc, days);
      return "to_bc or days not found for rental upload.";
    }
    const data = await this.btfsService.UploadJSON(json, to_bc, days);
    console.log("data💜💜: ",data);
    req.Hash = data.Hash;
    req.days = data.days;
    req.sessionId = data.sessionId;
    req.Size = data.Size;
    req.Name = data.Name;
    return data;
  }

  @Get("sdk/dev/get/json/:cid")
  @UseGuards(ApiKeyValidatorGuard)
  async getJsonDev(@Req() req, @Param("cid") cid: string){
    const response = await this.btfsService.freeTierGet(cid) as any;
    if(response.headers['content-type'] != 'application/json'){
      console.log(response.headers);
      throw new HttpException({"error": "The requested CID is not a JSON file."}, 400);
    }
    const buffer = Buffer.from(response.data);
    const jsonString = buffer.toString();
    return JSON.parse(jsonString);
  }

  @Post("sdk/apiKey/check")
  @UseGuards(ApiKeyValidatorGuard)
  async checkApiKey(@Req() req){
    return {"status": "success", "message": "API key is valid."};
  }

  // FETCH - routs
  
  @Get("/gateway/:cid")
  async gateway(@Param("cid") cid: string, @Res() res: Response):Promise<any>{
    const serviceResponse: any = await this.btfsService.freeTierGet(cid)
    Object.keys(serviceResponse.headers).forEach((key) => {
      res.setHeader(key, serviceResponse.headers[key]);
    });
    res.setHeader('Content-Type', serviceResponse.headers['content-type'] || 'application/octet-stream');
    return res.send(serviceResponse.data);
  }

  @Get("status/:cid")
  uploadStatus(@Param("cid") session_id: string){
    return this.btfsService.uploadStatus(session_id);
  }

}


