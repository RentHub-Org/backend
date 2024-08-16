// src/jwt/jwt.module.ts

import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtValidationService } from './jwt/jwt.service';
// import { ConfigModule } from '../config/config.module';
// import { ConfigService } from 'src/config/config.service';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      useFactory: async () => ({
        secret: "jwt_t0k3n_Gener@t0r",
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  providers: [JwtValidationService],
  exports: [JwtValidationService],
})
export class JwtModule {}
