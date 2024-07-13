// import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
// import { NotificationService } from './notification.service';
// import { CreateOnBordingDto, SendNotificationDto, WebHookIdDto } from './dto/notiffication.send.dto';
// import { isString } from 'class-validator';

// @Controller('notification')
// export class NotificationController {

//     constructor(private readonly notificationService: NotificationService) {}


//     @Post("onBording")
//     async getOnbordingURL(@Body() body: CreateOnBordingDto): Promise<String> {
//         return this.notificationService.getOnbordingLink(body);
//     }

//     @Post("notify")
//     async sendMessage(@Body() body: SendNotificationDto): Promise<String> {
//         console.log(body);
//         try{
//             return this.notificationService.sendMessage(body);
//         }catch(e){
//             return e;
//         }
//     }

//     @Post("webhook/:id")
//     async webHookHandler(@Param('id') webHookId: string, @Body() body: SendNotificationDto): Promise<String> {
//         console.log(body);
//         return this.notificationService.webHookHandler(webHookId, body);
//     }

//     @Post("checkUserName")
//     async validateUsername(@Param('id') username: string): Promise<{status:boolean}>{
//         return {status: await this.notificationService.isValidUsername(username)};
//     }
// }
