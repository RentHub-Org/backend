import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';


@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService]
})
export class ConfigModule {
  static froRoot(): DynamicModule {
    return {
      module: ConfigModule,
      global: true,
    }
  }
}
