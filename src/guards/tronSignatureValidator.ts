import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { utils } from 'tronweb';

@Injectable()
export class CheckTronSigGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const message: string = request.headers['tron_message'];
    const signature: string = request.headers['tron_signature'];
    console.log("innnn");
    console.log('Message:', message);
    console.log('Signature:', signature);
    if (!message || !signature) {
      throw new UnauthorizedException('Missing message or signature in the request body');
    }

    const userAddress = this.verifySignature(message, signature);
    request.userAddress = userAddress;
    return true;
  }

  verifySignature(message: string, signature: string): string {
    const sigAddress = utils.message.verifyMessage(message, signature);
    const validTill = parseInt(message.split(':')[1]);

    if (validTill < Date.now()) {
      throw new HttpException('Signature expired', HttpStatus.NON_AUTHORITATIVE_INFORMATION);
    }

    const address = message.split(':')[0];
    console.log('Address:', address);

    if (sigAddress !== address) {
      throw new HttpException('Address mismatch, not a valid signature.', HttpStatus.UNAUTHORIZED);
    }

    return address;
  }
}
