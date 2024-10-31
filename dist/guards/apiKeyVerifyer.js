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
exports.ApiKeyValidatorGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ApiKeyValidatorGuard = class ApiKeyValidatorGuard {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['api-key'];
        if (!apiKey) {
            throw new common_1.HttpException("Can't validate user: No apiKey provided", common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
        try {
            const data = await this.prisma.apiKeys.findFirst({
                where: {
                    key: apiKey,
                },
                include: {
                    owner: true,
                },
            });
            if (!data) {
                throw new common_1.HttpException('Invalid API key', common_1.HttpStatus.UNAUTHORIZED);
            }
            console.log('data', data);
            request.userAddress = data.owner.address;
        }
        catch (err) {
            console.log(err);
            throw new common_1.HttpException('Unable to reach DB.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return true;
    }
};
exports.ApiKeyValidatorGuard = ApiKeyValidatorGuard;
exports.ApiKeyValidatorGuard = ApiKeyValidatorGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApiKeyValidatorGuard);
//# sourceMappingURL=apiKeyVerifyer.js.map