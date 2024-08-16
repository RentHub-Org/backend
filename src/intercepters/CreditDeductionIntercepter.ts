import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DeductCreditsInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
        tap(async () => {
            const request = context.switchToHttp().getRequest();
            const userAddress = request.userAddress;
            const creditToDeduct = request.creditRequired;
            console.log("creditToDeduct",creditToDeduct);
            
        if (userAddress) {
          // Deduct credits logic
          await this.prisma.user.update({
            where: { address: userAddress },
            data: {
              credits: {
                decrement: creditToDeduct,
              },
            },
          });

          console.log(`Credits deducted from user: ${userAddress}`);
        }
      }),
    );
  }
}
