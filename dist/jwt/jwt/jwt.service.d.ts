import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
export declare class JwtValidationService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    decodeToken(token: string): JwtPayload;
    validateToken(token: string): JwtPayload;
}
