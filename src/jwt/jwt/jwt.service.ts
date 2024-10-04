// src/jwt/jwt.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtValidationService {
  constructor(private readonly jwtService: JwtService) {}

  decodeToken(token: string): JwtPayload {
    try {
      return this.jwtService.decode(token) as JwtPayload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  validateToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}