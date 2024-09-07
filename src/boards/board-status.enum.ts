/*export interface Board {
    id: string;
    title: string;
    description: string;
    status: BoardStatus;
}*/

// 열거형을 통해 두가지 상태를 정의
export enum BoardStatus {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}
