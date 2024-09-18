import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getUser() {
        return '안녕';
    }

    postUser() {
        return '';
    }
}
