import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { utils } from 'tronweb';
import { JwtValidationService } from '../jwt/jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService, // Inject PrismaService
    readonly jwtValidationService: JwtValidationService,
  ) {}
  async deleteTelegramHandle(
    signature: string,
    message: string,
  ): Promise<string> {
    const sigAddress = utils.message.verifyMessage(message, signature);
    if (sigAddress !== message.split(':')[0]) {
      throw new HttpException('Signature is invalid', 400);
    }
    const telegram = message.split(':')[1];
    if (telegram === undefined) {
      throw new HttpException('Telegram handle is required', 400);
    }
    //scaning the db here...
    const user = await this.prisma.telegramEndPoints.findFirst({
      where: {
        username: telegram,
      },
    });
    if (!user) {
      throw new HttpException('Telegram handle not found', 404);
    }
    if (user.nameHolder !== sigAddress) {
      throw new HttpException('onwership mismatch of the handle.', 400);
    }
    await this.prisma.telegramEndPoints.delete({
      where: {
        username: telegram,
      },
    });
    return 'Telegram handle deleted successfully';
  }

  async addTelegramHandle(signature: string, message: string): Promise<any> {
    const sigAddress = utils.message.verifyMessage(message, signature);
    if (sigAddress !== message.split(':')[0]) {
      throw new HttpException('Signature is invalid', 400);
    }
    const telegram = message.split(':')[1];
    if (telegram === undefined) {
      throw new HttpException('Telegram handle is required', 400);
    }
    const user = await this.prisma.telegramEndPoints.findFirst({
      where: {
        username: telegram,
      },
    });
    if (user) {
      throw new HttpException('Telegramhandle already exists', 400);
    }
    await this.prisma.telegramEndPoints.create({
      data: {
        nameHolder: sigAddress,
        username: telegram,
      },
    });
    return 'Telegram handle added successfully';
  }

  async getTelegramHandles(token: string) {
    const user = this.jwtValidationService.decodeToken(token) as any;
    if (user === null) {
      throw new HttpException('Invalid token', 400);
    }
    const telegramHandles = await this.prisma.telegramEndPoints.findMany({
      where: {
        nameHolder: user.address.base56,
      },
    });
    return telegramHandles;
  }
}
