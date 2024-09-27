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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const tronweb_1 = require("tronweb");
const jwt_service_1 = require("../jwt/jwt/jwt.service");
let UserService = class UserService {
    constructor(prisma, jwtValidationService) {
        this.prisma = prisma;
        this.jwtValidationService = jwtValidationService;
    }
    async deleteTelegramHandle(signature, message) {
        const sigAddress = tronweb_1.utils.message.verifyMessage(message, signature);
        if (sigAddress !== message.split(':')[0]) {
            throw new common_1.HttpException('Signature is invalid', 400);
        }
        const telegram = message.split(':')[1];
        if (telegram === undefined) {
            throw new common_1.HttpException('Telegram handle is required', 400);
        }
        const user = await this.prisma.telegramEndPoints.findFirst({
            where: {
                username: telegram,
            },
        });
        if (!user) {
            throw new common_1.HttpException('Telegram handle not found', 404);
        }
        if (user.nameHolder !== sigAddress) {
            throw new common_1.HttpException('onwership mismatch of the handle.', 400);
        }
        await this.prisma.telegramEndPoints.delete({
            where: {
                username: telegram,
            },
        });
        return 'Telegram handle deleted successfully';
    }
    async addTelegramHandle(signature, message) {
        const sigAddress = tronweb_1.utils.message.verifyMessage(message, signature);
        if (sigAddress !== message.split(':')[0]) {
            throw new common_1.HttpException('Signature is invalid', 400);
        }
        const telegram = message.split(':')[1];
        if (telegram === undefined) {
            throw new common_1.HttpException('Telegram handle is required', 400);
        }
        const user = await this.prisma.telegramEndPoints.findFirst({
            where: {
                username: telegram,
            },
        });
        if (user) {
            throw new common_1.HttpException('Telegramhandle already exists', 400);
        }
        await this.prisma.telegramEndPoints.create({
            data: {
                nameHolder: sigAddress,
                username: telegram,
            },
        });
        return 'Telegram handle added successfully';
    }
    async getTelegramHandles(token) {
        const user = this.jwtValidationService.decodeToken(token);
        if (user === null) {
            throw new common_1.HttpException('Invalid token', 400);
        }
        const telegramHandles = await this.prisma.telegramEndPoints.findMany({
            where: {
                nameHolder: user.address.base56,
            },
        });
        return telegramHandles;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_service_1.JwtValidationService])
], UserService);
//# sourceMappingURL=user.service.js.map