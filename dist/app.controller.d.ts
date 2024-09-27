import { Response } from 'express';
import { AppService } from './app.service';
import { BtfsNodeService } from './btfs-node/btfs-node.service';
export declare class AppController {
    private readonly appService;
    private readonly btfsService;
    constructor(appService: AppService, btfsService: BtfsNodeService);
    getHello(): string;
    uploadFile(file: Express.Multer.File): Promise<any>;
    rentalUploadFile(to_bc: any, days: number, file: Express.Multer.File): Promise<any>;
    uploadCheckFile(file: Express.Multer.File, req: any): Promise<any>;
    rentalUploadFileViaSig(to_bc: any, days: number, file: Express.Multer.File, req: any): Promise<any>;
    uploadCheckFileSDK(file: Express.Multer.File, req: any): Promise<any>;
    uploadJsonViaSdk(json: any, req: any): Promise<any>;
    rentalUploadFileViaSDK(to_bc: any, days: number, file: Express.Multer.File, req: any): Promise<any>;
    rentalUploadJsonViaSDK(to_bc: any, days: number, json: any, req: any): Promise<any>;
    getJsonDev(req: any, cid: string): Promise<any>;
    checkApiKey(): Promise<{
        status: string;
        message: string;
    }>;
    gateway(cid: string, res: Response): Promise<any>;
    uploadStatus(session_id: string): Promise<any>;
}
