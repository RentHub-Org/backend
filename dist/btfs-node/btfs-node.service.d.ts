import { HttpService } from '@nestjs/axios';
export declare class BtfsNodeService {
    private readonly httpService;
    constructor(httpService: HttpService);
    freeTierUpload(file: Express.Multer.File): Promise<any>;
    freeTierGet(cid: string): Promise<any>;
    remtalUpload(file: Express.Multer.File, to_bc: any, rentForDays?: number): Promise<any>;
    freeTierUploadJSON(json: any): Promise<any>;
    UploadJSON(json: any, to_bc: any, rentForDays?: number): Promise<any>;
    uploadStatus(session_id: string): Promise<any>;
}
