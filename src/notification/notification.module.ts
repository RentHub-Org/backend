// import { Module } from '@nestjs/common';
// import { NotificationService } from './notification.service';
// import { NotificationController } from './notification.controller';
// import { TelegrafModule } from 'nestjs-telegraf';
// import { JwtModule } from '@nestjs/jwt';

// @Module({
//   imports: [
//     JwtModule.register({
//       global: true,
//       secret: "temprary_token_secret",
//       signOptions: { expiresIn: '600s' }, // 10 minutes
//     }),
//     TelegrafModule.forRoot({
//       token: "6494617139",
//     }),
//   ],
//   providers: [NotificationService,],
//   controllers: [NotificationController]
// })
// export class NotificationModule {}
