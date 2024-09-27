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
exports.DeductCreditsInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const prisma_service_1 = require("../prisma/prisma.service");
let DeductCreditsInterceptor = class DeductCreditsInterceptor {
    constructor(prisma) {
        this.prisma = prisma;
    }
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.tap)(async () => {
            const request = context.switchToHttp().getRequest();
            const userAddress = request.userAddress;
            const creditToDeduct = request.creditRequired;
            console.log('creditToDeduct', creditToDeduct);
            if (userAddress) {
                try {
                    await this.prisma.$transaction(async (prismaTxn) => {
                        const user = await prismaTxn.user.findUnique({
                            where: {
                                address: userAddress,
                            },
                            select: {
                                credits: true,
                                address: true,
                            },
                        });
                        if (!user) {
                            throw new Error(`User with address ${userAddress} not found while deducting credits`);
                        }
                        const newCredits = user.credits - BigInt(creditToDeduct);
                        console.log('newCredits : ', newCredits);
                        await prismaTxn.user.update({
                            where: { address: userAddress },
                            data: {
                                credits: {
                                    decrement: creditToDeduct,
                                },
                            },
                        });
                        await prismaTxn.creditUsage.create({
                            data: {
                                userAddr: userAddress,
                                credits: newCredits,
                                timestamp: new Date(),
                            },
                        });
                    });
                }
                catch (error) {
                    console.error(error);
                    throw new common_1.HttpException('Failed to deduct credits from user', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
                console.log(`Credits deducted from user: ${userAddress}`);
            }
        }));
    }
};
exports.DeductCreditsInterceptor = DeductCreditsInterceptor;
exports.DeductCreditsInterceptor = DeductCreditsInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DeductCreditsInterceptor);
//# sourceMappingURL=CreditDeductionIntercepter.js.map