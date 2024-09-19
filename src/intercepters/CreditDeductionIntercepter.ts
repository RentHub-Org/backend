import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
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
                throw new Error(
                  `User with address ${userAddress} not found while deducting credits`,
                );
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
          } catch (error) {
            console.error(error);
            throw new HttpException(
              'Failed to deduct credits from user',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }

          console.log(`Credits deducted from user: ${userAddress}`);
        }
      }),
    );
  }
}
