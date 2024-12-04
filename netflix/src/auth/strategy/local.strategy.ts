import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';

import { AuthService } from '../auth.service';

export class LocalAuthGuard extends AuthGuard('codefactory') {}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'codefactory') {
    constructor(private readonly authService: AuthService) {
        super({ usernameField: 'email' }); // 기본 필드가 username이기 때문에 email로 변경
    }

    // LocalStrategy는 validate와 username과 password를 넣어주게 되어 있음
    // return -> Request()
    async validate(email: string, password: string) {
        const user = await this.authService.authenticate(email, password);

        return user;
    }
}
