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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const app_service_1 = require("./app.service");
const btfs_node_service_1 = require("./btfs-node/btfs-node.service");
const apiKeyVerifyer_1 = require("./guards/apiKeyVerifyer");
const quataValidator_1 = require("./guards/quataValidator");
const tronSignatureValidator_1 = require("./guards/tronSignatureValidator");
const CreditDeductionIntercepter_1 = require("./intercepters/CreditDeductionIntercepter");
const FileReciptCreaterDevInterceptor_1 = require("./intercepters/FileReciptCreaterDevInterceptor");
const FileReciptCreaterRentalIntercepter_1 = require("./intercepters/FileReciptCreaterRentalIntercepter");
let AppController = class AppController {
    constructor(appService, btfsService) {
        this.appService = appService;
        this.btfsService = btfsService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async uploadCheckFile(file, req) {
        const returnDataFreeTier = await this.btfsService.freeTierUpload(file);
        console.log(returnDataFreeTier);
        req.file_hash = returnDataFreeTier.Hash;
        req.file_size = returnDataFreeTier.Size;
        req.file_name = returnDataFreeTier.Name;
        return returnDataFreeTier;
    }
    async rentalUploadFileViaSig(to_bc, days, fileSize, file, req) {
        if (to_bc == undefined || days == undefined || fileSize == undefined) {
            console.log(to_bc, days);
            return 'hehe';
        }
        const data = await this.btfsService.remtalUpload(file, to_bc, days);
        console.log('data ; ', data.Size);
        console.log('data💜💜: ', data);
        req.Hash = data.Hash;
        req.days = data.days;
        req.sessionId = data.sessionId;
        req.Size = data.Size;
        req.Name = data.Name;
        return true;
    }
    async uploadCheckFileSDK(file, req) {
        const returnDataFreeTier = await this.btfsService.freeTierUpload(file);
        console.log(returnDataFreeTier);
        req.file_hash = returnDataFreeTier.Hash;
        req.file_size = returnDataFreeTier.Size;
        req.file_name = returnDataFreeTier.Name;
        return returnDataFreeTier;
    }
    async uploadJsonViaSdk(json, req) {
        const returnDataFreeTier = await this.btfsService.freeTierUploadJSON(json);
        console.log(returnDataFreeTier);
        req.file_hash = returnDataFreeTier.Hash;
        req.file_size = returnDataFreeTier.Size;
        req.file_name = returnDataFreeTier.Name;
        return returnDataFreeTier;
    }
    async rentalUploadFileViaSDK(to_bc, days, file, req) {
        if (to_bc == undefined || days == undefined) {
            console.log(to_bc, days);
            return 'to_bc or days not found for rental upload.';
        }
        const data = await this.btfsService.remtalUpload(file, to_bc, days);
        console.log('data💜💜: ', data);
        req.Hash = data.Hash;
        req.days = data.days;
        req.sessionId = data.sessionId;
        req.Size = data.Size;
        req.Name = data.Name;
        return data;
    }
    async rentalUploadJsonViaSDK(to_bc, days, json, req) {
        if (to_bc == undefined || days == undefined) {
            console.log(to_bc, days);
            return 'to_bc or days not found for rental upload.';
        }
        const data = await this.btfsService.UploadJSON(json, to_bc, days);
        console.log('data💜💜: ', data);
        req.Hash = data.Hash;
        req.days = data.days;
        req.sessionId = data.sessionId;
        req.Size = data.Size;
        req.Name = data.Name;
        return data;
    }
    async getJsonDev(req, cid) {
        const response = (await this.btfsService.freeTierGet(cid));
        if (response.headers['content-type'] != 'application/json') {
            console.log(response.headers);
            throw new common_1.HttpException({ error: 'The requested CID is not a JSON file.' }, 400);
        }
        const buffer = Buffer.from(response.data);
        const jsonString = buffer.toString();
        return JSON.parse(jsonString);
    }
    async checkApiKey() {
        return { status: 'success', message: 'API key is valid.' };
    }
    async gateway(cid, res) {
        const serviceResponse = await this.btfsService.freeTierGet(cid);
        Object.keys(serviceResponse.headers).forEach((key) => {
            res.setHeader(key, serviceResponse.headers[key]);
        });
        res.setHeader('Content-Type', serviceResponse.headers['content-type'] || 'application/octet-stream');
        return res.send(serviceResponse.data);
    }
    uploadStatus(session_id) {
        return this.btfsService.uploadStatus(session_id);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Post)('/tronSig/testout'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.UseGuards)(tronSignatureValidator_1.CheckTronSigGuard),
    (0, common_1.UseInterceptors)(CreditDeductionIntercepter_1.DeductCreditsInterceptor, FileReciptCreaterDevInterceptor_1.FileReciptCreaterDevInterceptor),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "uploadCheckFile", null);
__decorate([
    (0, common_1.Post)('tronSig/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.UseGuards)(quataValidator_1.QuotaValidatorGuard),
    (0, common_1.UseGuards)(tronSignatureValidator_1.CheckTronSigGuard),
    (0, common_1.UseInterceptors)(CreditDeductionIntercepter_1.DeductCreditsInterceptor, FileReciptCreaterRentalIntercepter_1.FileReciptCreaterRentalInterceptor),
    __param(0, (0, common_1.Query)('to-blockchain')),
    __param(1, (0, common_1.Query)('days')),
    __param(2, (0, common_1.Query)('fileSize')),
    __param(3, (0, common_1.UploadedFile)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "rentalUploadFileViaSig", null);
__decorate([
    (0, common_1.Post)('/sdk/dev'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.UseGuards)(quataValidator_1.QuotaValidatorGuard),
    (0, common_1.UseGuards)(apiKeyVerifyer_1.ApiKeyValidatorGuard),
    (0, common_1.UseInterceptors)(CreditDeductionIntercepter_1.DeductCreditsInterceptor, FileReciptCreaterDevInterceptor_1.FileReciptCreaterDevInterceptor),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "uploadCheckFileSDK", null);
__decorate([
    (0, common_1.Post)('/sdk/dev/pinJson'),
    (0, common_1.UseGuards)(quataValidator_1.QuotaValidatorGuard),
    (0, common_1.UseGuards)(apiKeyVerifyer_1.ApiKeyValidatorGuard),
    (0, common_1.UseInterceptors)(CreditDeductionIntercepter_1.DeductCreditsInterceptor, FileReciptCreaterDevInterceptor_1.FileReciptCreaterDevInterceptor),
    __param(0, (0, common_1.Body)('json')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "uploadJsonViaSdk", null);
__decorate([
    (0, common_1.Post)('sdk/rental'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.UseGuards)(quataValidator_1.QuotaValidatorGuard),
    (0, common_1.UseGuards)(apiKeyVerifyer_1.ApiKeyValidatorGuard),
    (0, common_1.UseInterceptors)(CreditDeductionIntercepter_1.DeductCreditsInterceptor, FileReciptCreaterRentalIntercepter_1.FileReciptCreaterRentalInterceptor),
    __param(0, (0, common_1.Query)('to-blockchain')),
    __param(1, (0, common_1.Query)('days')),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "rentalUploadFileViaSDK", null);
__decorate([
    (0, common_1.Post)('/sdk/rental/pinJson'),
    (0, common_1.UseGuards)(quataValidator_1.QuotaValidatorGuard),
    (0, common_1.UseGuards)(apiKeyVerifyer_1.ApiKeyValidatorGuard),
    (0, common_1.UseInterceptors)(CreditDeductionIntercepter_1.DeductCreditsInterceptor, FileReciptCreaterRentalIntercepter_1.FileReciptCreaterRentalInterceptor),
    __param(0, (0, common_1.Query)('to-blockchain')),
    __param(1, (0, common_1.Query)('days')),
    __param(2, (0, common_1.Body)('json')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "rentalUploadJsonViaSDK", null);
__decorate([
    (0, common_1.Get)('sdk/dev/get/json/:cid'),
    (0, common_1.UseGuards)(apiKeyVerifyer_1.ApiKeyValidatorGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('cid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getJsonDev", null);
__decorate([
    (0, common_1.Post)('sdk/apiKey/check'),
    (0, common_1.UseGuards)(apiKeyVerifyer_1.ApiKeyValidatorGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "checkApiKey", null);
__decorate([
    (0, common_1.Get)('/gateway/:cid'),
    __param(0, (0, common_1.Param)('cid')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "gateway", null);
__decorate([
    (0, common_1.Get)('status/:cid'),
    __param(0, (0, common_1.Param)('cid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "uploadStatus", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        btfs_node_service_1.BtfsNodeService])
], AppController);
//# sourceMappingURL=app.controller.js.map