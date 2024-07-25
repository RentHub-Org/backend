import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BtfsNodeModule } from './btfs-node/btfs-node.module';
// import { ConfigModule } from './config/config.module';
import { MulterModule } from '@nestjs/platform-express';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    BtfsNodeModule,
    MulterModule.register({
      dest: './uploads',
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
