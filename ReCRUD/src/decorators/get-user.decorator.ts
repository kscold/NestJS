import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): User => {
    // 실행 컨텍스트를 뽑기 위해 ExecutionContext를 사용
    const req = ctx.switchToHttp().getRequest(); // ExecutionContext의 switchToHttp().getRequest()로 요청을 확인
    return req.user;
});
