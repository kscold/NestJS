import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserSigninDto } from './dto/user.signin.dto';
import { UserSignupDto } from './dto/user.signup.dto';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    // 이메일 중복 체크 로직
    async checkEmail(email: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { email } });
        return user ? true : false;
    }

    // 회원가입 로직
    async signUp(userSignupDto: UserSignupDto): Promise<{ message: string; statusCode: number }> {
        const { nickname, email, password } = userSignupDto;

        // 이메일 중복 체크
        const emailExists = await this.checkEmail(email);
        if (emailExists) {
            throw new ConflictException('이미 존재하는 이메일입니다.');
        }

        // 비밀번호 해시화 및 사용자 생성
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = this.userRepository.create({
            email,
            password: hashedPassword,
            nickname,
        });

        try {
            await this.userRepository.save(newUser);
            return {
                message: `${nickname}님이 회원가입되었습니다.`,
                statusCode: 200,
            };
        } catch (error) {
            throw new InternalServerErrorException('회원가입에 실패했습니다.');
        }
    }

    // 로그인 로직
    async signIn(userSigninDto: UserSigninDto): Promise<{ message: string; statusCode: number; accessToken: string }> {
        const { email, password } = userSigninDto;
        const user = await this.userRepository.findOne({ where: { email } });

        if (user && (await bcrypt.compare(password, user.password))) {
            const payload = { email };
            const accessToken = await this.jwtService.sign(payload);

            return {
                message: `${user.nickname}님이 로그인되었습니다.`,
                statusCode: 200,
                accessToken: accessToken,
            };
        } else {
            throw new UnauthorizedException('잘못된 인증 정보입니다.');
        }
    }

}
