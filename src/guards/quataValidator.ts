import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { calculateRequiredCost } from './creditCalculator';

@Injectable()
export class QuotaValidatorGuard implements CanActivate {
    constructor(
        private readonly prisma: PrismaService, // Inject PrismaService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        let _days: number = 30;
        if(request?.query?.days){
            _days = parseInt(request.query.days.toString());
        }
        if(!_days || _days < 30){
          _days = 30;
        }
        const userAddress = request.userAddress;
        console.log(userAddress);
        if (!userAddress) {
            throw new HttpException("Can't validate quota: User address not found", HttpStatus.SERVICE_UNAVAILABLE);
        }

        // Retrieve user data from the database
        const user = await this.prisma.user.findFirst({
            where: {
                address: userAddress,
            },
        });

        if (!user) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }

        const { credits } = user;
        // we have to passs the file size and the days for the credit calculation.... 🥹🥹
        const creditRequired = calculateRequiredCost();
        //setting the credits required.
        request.creditRequired = creditRequired;

        if (credits < creditRequired) {
            throw new HttpException("Not sufficient credit present.", HttpStatus.NOT_ACCEPTABLE);
        }
        // If the user has sufficient credits, allow the request to proceed
        return true;
    }
}
