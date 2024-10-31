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
exports.FileReciptCreaterRentalInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const prisma_service_1 = require("../prisma/prisma.service");
let FileReciptCreaterRentalInterceptor = class FileReciptCreaterRentalInterceptor {
    constructor(prisma) {
        this.prisma = prisma;
    }
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.tap)(async () => {
            const request = context.switchToHttp().getRequest();
            const userAddress = request.userAddress;
            const fileHash = request.Hash;
            const fileSize = request.Size;
            const sessionId = request.sessionId;
            const forDays = request.days;
            const name = request.Name;
            if (fileHash === undefined || fileSize === undefined || sessionId === undefined)
                return;
            const newFile = await this.prisma.file.create({
                data: {
                    hash: fileHash,
                    name: name,
                    sessionId: sessionId,
                    size: fileSize,
                    expires_in_days: parseInt(forDays),
                    rentralStatusId: "",
                    listType: "RENTAL",
                    updated_on: new Date(),
                    createdBy: { connect: { address: userAddress } },
                }
            });
            console.log("how u doing bebo... FILE:", newFile);
        }));
    }
};
exports.FileReciptCreaterRentalInterceptor = FileReciptCreaterRentalInterceptor;
exports.FileReciptCreaterRentalInterceptor = FileReciptCreaterRentalInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FileReciptCreaterRentalInterceptor);
//# sourceMappingURL=FileReciptCreaterRentalIntercepter.js.map