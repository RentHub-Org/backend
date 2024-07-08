import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BtfsNodeModule } from './btfs-node/btfs-node.module';
// import { ConfigModule } from './config/config.module';
import { MulterModule } from './multer/multer.module';

@Module({
  imports: [
    BtfsNodeModule,
    MulterModule, 
    // ConfigModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
