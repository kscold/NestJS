import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Public } from '../decorator/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.get(Public, context.getHandler());

        // 만약에 public decoration이 되어있으면 모든 로직을 bypass
        if (isPublic) {
            return true;
        }

        // 요청에 user가 존재하는지 확인
        const request = context.switchToHttp().getRequest();

        if (!request.user || request.user.type !== 'access') {
            return false;
        }

        return true;
    }
}
