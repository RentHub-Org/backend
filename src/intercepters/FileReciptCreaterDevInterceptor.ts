import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { constrainedMemory } from 'process';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FileReciptCreaterDevInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
        tap(async () => {
            const request = context.switchToHttp().getRequest();
            const userAddress: string = request.userAddress as string;
            const fileHash = request.file_hash;
            const fileSize = request.file_size;
            const name = request.file_name;
            const newFile = await this.prisma.file.create({
                data: {
                    hash: fileHash as string,
                    name: name as string,
                    sessionId: "dev_env_file",
                    size: fileSize as number,
                    expires_in_days: 0,
                    rentralStatusId: "dev_env_file",
                    listType: "DEV",
                    updated_on: new Date(),
                    createdBy: { connect: { address: userAddress as string } },
                }
            });
            console.log("new created file is:", newFile);
        }),
    );
  }
}
