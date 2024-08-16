import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from "../jwt/jwt.module";
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [JwtModule],
  providers: [UserService, PrismaService],
  controllers: [UserController]
})
export class UserModule {}
