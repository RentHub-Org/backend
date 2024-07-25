import { HttpException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { utils } from "tronweb"; 

@Injectable()
export class UserService {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }
    async deleteTelegramHandle( signature: string, message: string, telegram: string): Promise<string> {
        const sigAddress = utils.message.verifyMessage(message, signature);
        if(sigAddress !== message.split(":")[0]){
            throw new HttpException("Signature is invalid", 400);
        }
        //scaning the db here...
        const user = await this.prisma.telegramEndPoints.findFirst({
            where: {
                username: telegram
            }
        })
        if(!user){
            throw new HttpException("Telegramhandle not found", 404);
        }    
        if(user.nameHolder !== sigAddress){
            throw new HttpException("onwership mismatch of the handle.", 400);
        }
        await this.prisma.telegramEndPoints.delete({
            where: {
                username: telegram
            }
        })
        return "Telegram handle deleted successfully";
    }

    async addTelegramHandle( signature: string, message: string, telegram: string): Promise<any> {
        const sigAddress = utils.message.verifyMessage(message, signature);
        if(sigAddress !== message.split(":")[0]){
            throw new HttpException("Signature is invalid", 400);
        }
        const user = await this.prisma.telegramEndPoints.findFirst({
            where: {
                username: telegram
            }
        })
        if(user){
            throw new HttpException("Telegramhandle already exists", 400);
        }
        await this.prisma.telegramEndPoints.create({
            data: {
                nameHolder: sigAddress,
                username: telegram
            }
        })
        return "Telegram handle added successfully";
    }
}
