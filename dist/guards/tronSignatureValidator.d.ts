import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class CheckTronSigGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
    verifySignature(message: string, signature: string): string;
}
