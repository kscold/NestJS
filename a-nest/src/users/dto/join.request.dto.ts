import { PickType } from '@nestjs/swagger';
import { Users } from '../../entities/Users';

// 특정 속성만 선핵하여 새로운 Dto를 선언
export class JoinRequestDto extends PickType(Users, [
    'email',
    'nickname',
    'password',
] as const) {}
