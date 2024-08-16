// import { DynamicModule, Global, Module } from '@nestjs/common';
// import { ConfigService } from './config.service';


// @Global()
// @Module({
//   providers: [ConfigService],
//   exports: [ConfigService]
// })
// export class ConfigModule {
//   static froRoot(): DynamicModule {
//     return {
//       module: ConfigModule,
//       global: true,
//     }
//   }
// }


// src/config/config.module.ts

// import { Module } from '@nestjs/common';
// import { ConfigService } from './config.service';

// @Module({
//   providers: [ConfigService],
//   exports: [ConfigService],
// })
// export class ConfigModule {}

import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
