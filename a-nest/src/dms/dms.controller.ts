import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('api/workspaces/:url/dms')
@ApiTags('DM')
export class DmsController {
    @Get(':id/chats')
    @ApiParam({
        name: 'url',
        required: true,
        description: '워크스페이스 url',
    })
    @ApiParam({
        name: 'id',
        required: true,
        description: '사용자 아이디',
    })
    @ApiQuery({
        name: 'perPage',
        required: true,
        description: '한 번에 가져오는 개수',
    })
    @ApiQuery({
        name: 'page',
        required: true,
        description: '불러온 페이지',
    })
    getChat(@Query() query, @Param() param) {
        console.log(query.perPage, query.page);
        console.log(param.id, param.url);
    }

    @Post(':id/chats')
    postChat() {}
}
