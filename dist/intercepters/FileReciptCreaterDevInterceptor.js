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
exports.FileReciptCreaterDevInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const prisma_service_1 = require("../prisma/prisma.service");
let FileReciptCreaterDevInterceptor = class FileReciptCreaterDevInterceptor {
    constructor(prisma) {
        this.prisma = prisma;
    }
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.tap)(async () => {
            const request = context.switchToHttp().getRequest();
            const userAddress = request.userAddress;
            const fileHash = request.file_hash;
            const fileSize = request.file_size;
            const name = request.file_name;
            const newFile = await this.prisma.file.create({
                data: {
                    hash: fileHash,
                    name: name,
                    sessionId: "dev_env_file",
                    size: fileSize,
                    expires_in_days: 0,
                    rentralStatusId: "dev_env_file",
                    listType: "DEV",
                    updated_on: new Date(),
                    createdBy: { connect: { address: userAddress } },
                }
            });
            console.log("new created file is:", newFile);
        }));
    }
};
exports.FileReciptCreaterDevInterceptor = FileReciptCreaterDevInterceptor;
exports.FileReciptCreaterDevInterceptor = FileReciptCreaterDevInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FileReciptCreaterDevInterceptor);
//# sourceMappingURL=FileReciptCreaterDevInterceptor.js.map