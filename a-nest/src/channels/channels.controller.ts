import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/workspaces/:url/channels')
@ApiTags('CHANNEL')
export class ChannelsController {
    @Get()
    getAllChannels() {}

    @Post()
    createChannels() {}

    @Get(':name')
    getSpecificChannel() {}

    @Get(':name/chats')
    getChats(@Query() query, @Param() param) {
        console.log(query.perPage, query.page);
        console.log(param.id, param.url);
    }

    @Post(':name/chats')
    postChat(@Body() body) {}

    @Get(':name/members')
    getAllMembers() {}

    @Post(':name/members')
    inviteMembers() {}
}
