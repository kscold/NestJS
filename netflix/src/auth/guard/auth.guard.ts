import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Public } from '../decorator/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // 요청에 user가 존재하는지 확인
        const isPublic = this.reflector.get(Public, context.getHandler());

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        if (!request.user || request.user.type !== 'access') {
            return false;
        }

        return true;
    }
}
