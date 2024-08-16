import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FileReciptCreaterRentalInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
        tap(async () => {
            const request = context.switchToHttp().getRequest();
            const userAddress: string = request.userAddress as string;
            const fileHash = request.Hash;
            const fileSize = request.Size;
            const sessionId = request.sessionId;
            const forDays = request.days;
            const newFile = await this.prisma.file.create({
                data: {
                    hash: fileHash as string,
                    sessionId: sessionId as string,
                    size: fileSize as number,
                    expires_in_days: parseInt(forDays) as number,
                    rentralStatusId: "",
                    listType: "RENTAL",
                    updated_on: new Date(),
                    createdBy: { connect: { address: userAddress as string } },
                }
            });
            console.log("how u doing bebo... FILE:",newFile);
        }),
    );
  }
}
