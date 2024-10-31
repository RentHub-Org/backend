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
exports.QuotaValidatorGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const creditCalculator_1 = require("./creditCalculator");
let QuotaValidatorGuard = class QuotaValidatorGuard {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        let _days = 30;
        let fileSize = 0;
        if (request?.query?.fileSize) {
            fileSize = parseInt(request.query?.fileSize);
        }
        console.log('fieleSize: ', fileSize);
        console.log('days: ', request.query.days.toString());
        if (request?.query?.days) {
            _days = parseInt(request.query.days.toString());
        }
        if (!_days || _days < 30) {
            _days = 30;
        }
        if (fileSize <= 0) {
            throw new common_1.HttpException('File size must be greater than 0', common_1.HttpStatus.BAD_REQUEST);
        }
        const userAddress = request.userAddress;
        console.log(userAddress);
        if (!userAddress) {
            throw new common_1.HttpException("Can't validate quota: User address not found", common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
        const user = await this.prisma.user.findFirst({
            where: {
                address: userAddress,
            },
        });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        console.log('filzesie : ', fileSize);
        const { credits } = user;
        const creditRequired = (0, creditCalculator_1.calculateRequiredCost)(fileSize, _days);
        console.log('credits Rqued : ', creditRequired);
        request.creditRequired = creditRequired;
        if (credits < creditRequired) {
            throw new common_1.HttpException('Not sufficient credit present.', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        return true;
    }
};
exports.QuotaValidatorGuard = QuotaValidatorGuard;
exports.QuotaValidatorGuard = QuotaValidatorGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuotaValidatorGuard);
//# sourceMappingURL=quataValidator.js.map