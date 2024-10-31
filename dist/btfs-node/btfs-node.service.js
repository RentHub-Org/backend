"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BtfsNodeService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const rxjs_1 = require("rxjs");
const stream_1 = require("stream");
let BtfsNodeService = class BtfsNodeService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async freeTierUpload(file) {
        const molterFilePath = __dirname + '/../../' + file.path;
        console.log('file name btfs-node freties upload: path: ', molterFilePath);
        const stream = fs.createReadStream(molterFilePath);
        const formData = new FormData();
        formData.append('file', stream, file.originalname);
        const headers = {
            ...formData.getHeaders(),
        };
        return (0, rxjs_1.firstValueFrom)(this.httpService
            .post('http://localhost:5001/api/v1/add?', formData, { headers })
            .pipe((0, rxjs_1.map)((res) => {
            if (res.status == common_1.HttpStatus.BAD_REQUEST) {
                throw new common_1.HttpException('The file is too large to be uploaded. Please try to upload a smaller file.', common_1.HttpStatus.BAD_REQUEST);
            }
            else if (res.status == common_1.HttpStatus.OK) {
                return res.data;
            }
        }), (0, rxjs_1.tap)(() => {
            fs.unlinkSync(molterFilePath);
        })));
    }
    async freeTierGet(cid) {
        const redirectResponse = await (0, rxjs_1.lastValueFrom)(this.httpService
            .get(`http://localhost:8080/btfs/${cid}`, {
            responseType: 'arraybuffer',
        })
            .pipe((0, rxjs_1.catchError)((err) => {
            if (err.response.status === common_1.HttpStatus.MOVED_PERMANENTLY &&
                err.response.headers.location) {
                console.log();
                return (0, rxjs_1.of)(err.response);
            }
            err.response.data = JSON.parse('{"error":"the requested CID is no longer present in the testing environment","status":"404"}');
            err.response.headers['Content-Type'] = 'application/json';
            throw new common_1.HttpException(err.response.data, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }), (0, rxjs_1.map)((res) => {
            if (res.status === common_1.HttpStatus.OK) {
                const buffer = Buffer.from(res.data, 'binary');
                const stream = fs.createWriteStream(__dirname + `/../../write/${cid}`);
                stream.write(buffer);
                stream.end();
                return {
                    data: res.data,
                    headers: res.headers,
                };
            }
            const err = JSON.parse('{"error":"the requested CID is no longer present in the testing environment","status":"404"}');
            throw new common_1.HttpException(err, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        })));
        return redirectResponse;
    }
    async remtalUpload(file, to_bc, rentForDays = 30) {
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
        const nodeAddRes = await (0, rxjs_1.firstValueFrom)(this.httpService
            .post(`http://localhost:5001/api/v1/add?to-blockchain=${to_bc}`, formData, { headers })
            .pipe((0, rxjs_1.map)((res) => {
            if (res.status == common_1.HttpStatus.BAD_REQUEST) {
                throw new common_1.HttpException('The file is too large to be uploaded. Please try to upload a smaller file.', common_1.HttpStatus.BAD_REQUEST);
            }
            else if (res.status == common_1.HttpStatus.OK) {
                return res.data;
            }
            throw new common_1.HttpException('unexpected error in adding to node.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }), (0, rxjs_1.tap)(() => {
            fs.unlinkSync(molterFilePath);
        })));
        if (rentForDays < 30) {
            throw new common_1.HttpException('The minimum rental period is 30 days.', common_1.HttpStatus.BAD_REQUEST);
        }
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService
            .post(`http://localhost:5001/api/v1/storage/upload?arg=${nodeAddRes.Hash}&len=${rentForDays}`)
            .pipe((0, rxjs_1.catchError)((err) => {
            console.error(err);
            this.httpService.post(`http://localhost:5001/api/v1/files/rm?arg=${nodeAddRes.Hash}`, {});
            throw new common_1.HttpException('Error while uploding the file.... retry later', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }), (0, rxjs_1.map)((res) => {
            return res.data;
        })));
        const fileContext = {
            days: rentForDays,
            ...nodeAddRes,
            sessionId: response.ID,
        };
        return fileContext;
    }
    async freeTierUploadJSON(json) {
        const formData = new FormData();
        const stream = stream_1.Readable.from([JSON.stringify(json)]);
        formData.append('file', stream, new Date().toISOString() + '.json');
        const headers = {
            ...formData.getHeaders(),
        };
        return (0, rxjs_1.firstValueFrom)(this.httpService
            .post('http://localhost:5001/api/v1/add?', formData, { headers })
            .pipe((0, rxjs_1.map)((res) => {
            if (res.status == common_1.HttpStatus.BAD_REQUEST) {
                throw new common_1.HttpException('The file is too large to be uploaded. Please try to upload a smaller file.', common_1.HttpStatus.BAD_REQUEST);
            }
            else if (res.status == common_1.HttpStatus.OK) {
                return res.data;
            }
        })));
    }
    async UploadJSON(json, to_bc, rentForDays = 30) {
        if (to_bc == undefined) {
            to_bc = false;
        }
        const stream = stream_1.Readable.from([JSON.stringify(json)]);
        const formData = new FormData();
        formData.append('file', stream, new Date().toISOString() + '.json');
        const headers = {
            ...formData.getHeaders(),
        };
        const nodeAddRes = await (0, rxjs_1.firstValueFrom)(this.httpService
            .post(`http://localhost:5001/api/v1/add?to-blockchain=${to_bc}`, formData, { headers })
            .pipe((0, rxjs_1.map)((res) => {
            if (res.status == common_1.HttpStatus.BAD_REQUEST) {
                throw new common_1.HttpException('The file is too large to be uploaded. Please try to upload a smaller file.', common_1.HttpStatus.BAD_REQUEST);
            }
            else if (res.status == common_1.HttpStatus.OK) {
                return res.data;
            }
            throw new common_1.HttpException('unexpected error in adding to node.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        })));
        if (rentForDays < 30) {
            throw new common_1.HttpException('The minimum rental period is 30 days.', common_1.HttpStatus.BAD_REQUEST);
        }
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService
            .post(`http://localhost:5001/api/v1/storage/upload?arg=${nodeAddRes.Hash}&len=${rentForDays}`)
            .pipe((0, rxjs_1.catchError)((err) => {
            console.error(err);
            this.httpService.post(`http://localhost:5001/api/v1/files/rm?arg=${nodeAddRes.Hash}`, {});
            throw new common_1.HttpException('Error while uploding the file.... retry later', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }), (0, rxjs_1.map)((res) => {
            return res.data;
        })));
        const fileContext = {
            days: rentForDays,
            ...nodeAddRes,
            sessionId: response.ID,
        };
        return fileContext;
    }
    async uploadStatus(session_id) {
        console.log(session_id);
        const formData = new FormData();
        formData.append('session-id', session_id);
        const headers = {
            ...formData.getHeaders(),
        };
        return await (0, rxjs_1.lastValueFrom)(this.httpService
            .post(`http://localhost:5001/api/v1/storage/upload/status`, formData, {
            ...headers,
        })
            .pipe((0, rxjs_1.map)((res) => {
            return res.data;
        })));
    }
};
exports.BtfsNodeService = BtfsNodeService;
exports.BtfsNodeService = BtfsNodeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], BtfsNodeService);
//# sourceMappingURL=btfs-node.service.js.map