import { Module } from '@nestjs/common';
import { BtfsNodeService } from './btfs-node.service';
import { HttpModule } from '@nestjs/axios';
// import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    HttpModule,
    // ConfigModule
  ],
  providers: [BtfsNodeService],
  exports: [BtfsNodeService],
})
export class BtfsNodeModule {}
