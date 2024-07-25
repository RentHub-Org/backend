import { IsNotEmpty, IsString } from "class-validator";

export class deleteTelegramUsernameDto{
    @IsString()
    @IsNotEmpty()
    signature: string;
    
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    @IsNotEmpty()
    telegramHandle: string;
}