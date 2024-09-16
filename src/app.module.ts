import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BtfsNodeModule } from './btfs-node/btfs-node.module';
// import { ConfigModule } from './config/config.module';
import { MulterModule } from '@nestjs/platform-express';
import { UserModule } from './user/user.module';
import { JwtModule } from './jwt/jwt.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    BtfsNodeModule,
    MulterModule.register({
      dest: './uploads',
    }),
    UserModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
