import { Body, Controller, Delete, Post } from '@nestjs/common';
import { deleteTelegramUsernameDto } from './dto/deleteTelegramUsernameDto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(
        readonly userService: UserService
    ) {}

    @Post("deleteTelegramHandle")
    async deleteTelegramHandle(@Body() body: deleteTelegramUsernameDto): Promise<any> {
        return await this.userService.deleteTelegramHandle(body.signature, body.message, body.telegramHandle );
    }

    @Post("addTelegramHandle")
    async addTelegramHandle(@Body() body: deleteTelegramUsernameDto): Promise<any> {
        return await this.userService.addTelegramHandle(body.signature, body.message, body.telegramHandle );
    }

    
}
