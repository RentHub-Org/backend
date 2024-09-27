import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { calculateRequiredCost } from './creditCalculator';

@Injectable()
export class ApiKeyValidatorGuard implements CanActivate {
    constructor(
        private readonly prisma: PrismaService, // Inject PrismaService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers["api-key"];
        if (!apiKey) {
            throw new HttpException("Can't validate user: No apiKey provided", HttpStatus.SERVICE_UNAVAILABLE);
        }
        try{

            const data = await this.prisma.apiKeys.findFirst({
                where: {
                    key: apiKey as string,
                },
                include: {
                    owner: true,  // Include related owner data
                },
            });
            
            if (!data) {
                throw new HttpException("Invalid API key", HttpStatus.UNAUTHORIZED);
            }
            console.log("data",data);
            request.userAddress = data.owner.address;
        }catch(err){
            console.log(err);
            throw new HttpException("Unable to reach DB.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return true;
    }
}
