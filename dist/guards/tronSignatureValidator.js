"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckTronSigGuard = void 0;
const common_1 = require("@nestjs/common");
const tronweb_1 = require("tronweb");
let CheckTronSigGuard = class CheckTronSigGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const message = request.headers['tron_message'];
        const signature = request.headers['tron_signature'];
        console.log("innnn");
        console.log('Message:', message);
        console.log('Signature:', signature);
        if (!message || !signature) {
            throw new common_1.UnauthorizedException('Missing message or signature in the request body');
        }
        const userAddress = this.verifySignature(message, signature);
        request.userAddress = userAddress;
        return true;
    }
    verifySignature(message, signature) {
        const sigAddress = tronweb_1.utils.message.verifyMessage(message, signature);
        const validTill = parseInt(message.split(':')[1]);
        if (validTill < Date.now()) {
            throw new common_1.HttpException('Signature expired', common_1.HttpStatus.NON_AUTHORITATIVE_INFORMATION);
        }
        const address = message.split(':')[0];
        console.log('Address:', address);
        if (sigAddress !== address) {
            throw new common_1.HttpException('Address mismatch, not a valid signature.', common_1.HttpStatus.UNAUTHORIZED);
        }
        return address;
    }
};
exports.CheckTronSigGuard = CheckTronSigGuard;
exports.CheckTronSigGuard = CheckTronSigGuard = __decorate([
    (0, common_1.Injectable)()
], CheckTronSigGuard);
//# sourceMappingURL=tronSignatureValidator.js.map