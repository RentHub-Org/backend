import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '../jwt/jwt.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [JwtModule],
  providers: [UserService, PrismaService],
  controllers: [UserController],
})
export class UserModule {}
