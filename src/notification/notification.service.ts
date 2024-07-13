// import { Injectable } from '@nestjs/common';
// import { Start, Update, InjectBot } from 'nestjs-telegraf';
// import { Context} from 'telegraf';
// import * as CryptoJS from "crypto-js";
// import { CreateOnBordingDto, SendNotificationDto, WebHookIdDto } from './dto/notiffication.send.dto';
// import { PrismaClient } from '@prisma/client';
// import { JwtService } from '@nestjs/jwt';


// @Update()
// @Injectable()
// export class NotificationService {
//     private secretKey: string;
//     private bot: Context;
//     private prisma : PrismaClient;
//     constructor(
//         @InjectBot() bot: Context,
//         private readonly jwtServices: JwtService,
//     ) {
//         this.bot = bot;
//         this.prisma = new PrismaClient();
//         this.secretKey = "SecretTextForValidation";
//     }
//     BOT_USERNAME = 'agentNotificationBot';

//     @Start()
//     async hehe(ctx: Context) {
//         ctx.reply("Hello I'm <b>Agent Notifier</b> for BlockAgent.",{parse_mode:"HTML"});
//         const username: string = ctx.from.username;
//         const chatId = ctx.chat.id; // to be saved to prisma
//         //@ts-ignore
//         const token = ctx?.payload;

//         console.log(token);
//         const bytes = CryptoJS.AES.decrypt(token.replace(/-/g, '+').replace(/_/g, '/'), this.secretKey);
//         const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
//         const base64Decoded = CryptoJS.enc.Base64.parse(decryptedString).toString(CryptoJS.enc.Utf8);

//         const [validity, name] = base64Decoded.split(':');
//         console.log("val",validity,"name",name,"base",base64Decoded);

//         if(!token){
//             ctx.reply("IT seem that you have not provided a Token to validate the Start.",{parse_mode:"HTML"});
//             ctx.reply("You can create a token via this link: <Code> link_here </code>",{parse_mode:"HTML"});
//             return;
//         }
//         if(Number(validity) < Math.floor(Date.now() /1000)){
//             ctx.reply("Token is <b>Expired</b>. Please provide a valid token.",{parse_mode:"HTML"});
//             return;
//         }
//         if(name != username){
//             ctx.reply("This token dosen't belong to you. Please provide a valid token.",{parse_mode:"HTML"});
//             return;
//         }
//         const userFound = await this.prisma.telegramSubscribers.findFirst({
//             where: {
//                 username: username,
//             }
//         })
//         if(userFound){
//             ctx.reply(`Hello ${username}, You are already onboarded.`);
//             return;
//         }
//         const user = await this.prisma.telegramSubscribers.create({
//             data: {
//                 username: username,
//                 chatId: chatId.toString(),
//             }
//         });
//         ctx.reply(`Token is valid. ${user.username}, You are now onboarded.`);

//         await ctx.reply('Welcome');
//     }

//     getOnbordingLink(payload: CreateOnBordingDto ){
//         const expiresOn = Math.floor(Date.now() / 1000)+60;
//         const data = `${expiresOn}:${payload.username}`;
//         const base64Data = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
//         const token = CryptoJS.AES.encrypt(base64Data, this.secretKey).toString().replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

//         const onboardingUrl = `https://t.me/${this.BOT_USERNAME}?start=${token}`;
//         return onboardingUrl;
//     }

//     async sendMessage(payload: SendNotificationDto): Promise<String>{
//         const user = await this.prisma.telegramSubscribers.findFirst({
//             where:{
//                 username: payload.username,
//             }
//         });
//         if(!user){
//             throw new Error("User not found.");
//         }
//         this.bot.telegram.sendMessage(user.chatId, payload.message, {parse_mode:"HTML"});
//         return "Message Sent Sucessfully.";
//     }

//     async webHookHandler(webHookId: string, data: SendNotificationDto): Promise<String>{
//         // //  
//         // const identifyer = this.jwtServices.decode(webHookId.webHookId);
//         // console.log("it is the user whose web hook it is:",identifyer.user);
//         // // we can later charge the user depending on the userid 

//         return this.sendMessage(data);
//     }

//     async isValidUsername(username: string):Promise<boolean>{
//         const user = this.prisma.telegramSubscribers.findFirst({
//             where:{
//                 username: username
//             }
//         });
//         if(user){
//             return true;
//         }
//         return false;
//     }
// }
