import { deleteTelegramUsernameDto } from './dto/deleteTelegramUsernameDto';
import { UserService } from './user.service';
export declare class UserController {
    readonly userService: UserService;
    constructor(userService: UserService);
    deleteTelegramHandle(body: deleteTelegramUsernameDto): Promise<any>;
    addTelegramHandle(body: deleteTelegramUsernameDto): Promise<any>;
}
