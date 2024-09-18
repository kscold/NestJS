import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express'; // express의 req, res, next를 응용

// morgan 처럼 로깅해주는 미들웨어
// 실무에서는 NestMorgan을 적용시키는 것이 좋음
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP'); // HTTP 함수에 있는 로그만 추적

    use(request: Request, response: Response, next: NextFunction): void {
        // 라우터 시작할 때 기록을 함
        const { ip, method, originalUrl } = request;
        const userAgent = request.get('user-agent') || '';

        // 라우터 끝날 때 finish 후, on 비동기로 실행을 함
        response.on('finish', () => {
            const { statusCode } = response;
            const contentLength = response.get('content-length');

            this.logger.log(`${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
        });
        next();
    }
}
