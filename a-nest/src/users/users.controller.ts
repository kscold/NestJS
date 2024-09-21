import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseInterceptors,
} from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../common/dto/users..dto';
import { User } from '../common/decorator/user.decorator';
import { UndefinedToNullInterceptor } from '../common/interceptors/undefinedToNull..interceptor';

@UseInterceptors(UndefinedToNullInterceptor)
@Controller('api/users')
@ApiTags('USER')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @ApiOperation({ summary: '내 정보 조회' })
    @ApiResponse({ type: UserDto })
    getUsers(@Req() req) {
        return req.user;
    }

    @ApiOperation({ summary: '회원가입' })
    @Post()
    postUsers(@Body() data: JoinRequestDto) {
        this.usersService.postUser(data.email, data.nickname, data.password);
    }

    @ApiOperation({ summary: '로그인' })
    @ApiResponse({ status: 200, description: '성공', type: UserDto })
    @ApiResponse({ status: 500, description: '서버 에러' })
    @Post('login')
    login(@User() user) {
        return user;
    }

    @ApiOperation({ summary: '로그아웃' })
    @Post('logout')
    loginout(@Req() req, @Res() res) {
        req.logOut();
        res.clearCookie('connect.sid', { httpOnly: true });
        res.send('ok');
    }
}
