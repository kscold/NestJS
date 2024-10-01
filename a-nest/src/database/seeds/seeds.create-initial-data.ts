import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Workspaces } from '../../entities/Workspaces';
import { Channels } from '../../entities/Channels';
import dataSource from '../../data-source';

// 기본으로 회원이 생성될 때, 워크스페이스로 전환되기 때문에 데이터를 처음에 넣어주는 역할
export default class UserSeeder implements Seeder {
    public async run(
        ds: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<any> {
        const workspacesRepository = dataSource.getRepository(Workspaces);
        await workspacesRepository.insert([
            {
                id: 1,
                name: 'Sleact',
                url: 'sleact',
            },
        ]);
        const channelsRepository = dataSource.getRepository(Channels);
        await channelsRepository.insert([
            {
                id: 1,
                name: '일반',
                WorkspaceId: 1,
                private: false,
            },
        ]);
    }
}
