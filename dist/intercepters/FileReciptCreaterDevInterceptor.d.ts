import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class FileReciptCreaterDevInterceptor implements NestInterceptor {
    private readonly prisma;
    constructor(prisma: PrismaService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
