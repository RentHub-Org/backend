import { PrismaService } from 'src/prisma/prisma.service';
import { JwtValidationService } from '../jwt/jwt/jwt.service';
export declare class UserService {
    private readonly prisma;
    readonly jwtValidationService: JwtValidationService;
    constructor(prisma: PrismaService, jwtValidationService: JwtValidationService);
    deleteTelegramHandle(signature: string, message: string): Promise<string>;
    addTelegramHandle(signature: string, message: string): Promise<any>;
    getTelegramHandles(token: string): Promise<{
        username: string;
        nameHolder: string;
    }[]>;
}
