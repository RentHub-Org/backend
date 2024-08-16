import { Body, Controller, Delete, Post } from '@nestjs/common';
import { deleteTelegramUsernameDto } from './dto/deleteTelegramUsernameDto';
import { UserService } from './user.service';
import { GetBearerToken } from 'src/customDecorators/get-bearer-token.decorator';

@Controller('user')
export class UserController {

    constructor(
        readonly userService: UserService
    ) {}

    @Post("deleteTelegramHandle")
    async deleteTelegramHandle(@Body() body: deleteTelegramUsernameDto): Promise<any> {
        return await this.userService.deleteTelegramHandle(body.signature, body.message );
    }

    @Post("addTelegramHandle")
    async addTelegramHandle(@Body() body: deleteTelegramUsernameDto): Promise<any> {
        return await this.userService.addTelegramHandle(body.signature, body.message );
    }

    // @Post("getTelegramHandle")
    // async getTelegramHandles(@GetBearerToken() token: string ): Promise<any> {
    //     return await this.userService.getTelegramHandles(token);
    // }

    
}
