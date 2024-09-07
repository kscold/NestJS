import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { BoardStatus } from '../board-status.enum';

export class BoardStatusValidationPipe implements PipeTransform {
    // 외부에서 수정을 할 수 없도록 하기 위해 readonly 배열로 설정
    readonly StatusOptions = [BoardStatus.PRIVATE, BoardStatus.PRIVATE];

    transform(value: any, metadata: ArgumentMetadata): any {
        console.log('value', value); // value는 실제 바뀌는 값
        console.log('metadata', metadata); // 타켓하는 객체
        value = value.toUpperCase();

        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`${value} isn't in the status options`);
        }

        return value;
    }

    private isStatusValid(status: any) {
        const index = this.StatusOptions.indexOf(status);
        return index !== -1;
    }
}
