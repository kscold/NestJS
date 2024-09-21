import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/workspaces')
@ApiTags('WORKSPACE')
export class WorkspacesController {
    @Get()
    getMyWorkspaces() {}

    @Post()
    createWorkspaces() {}

    @Get(':url/members')
    getAllMembersFormWorkspace() {}

    @Post(':url/members')
    inviteMembersToWorkspace() {}

    @Delete(':url/members/:id')
    kickMembersFromWorkspace() {}

    @Get(':url/members/:id')
    getMembersInfoWorkspace() {}
}
