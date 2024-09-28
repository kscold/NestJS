// import { Seeder, SeederFactoryManager } from 'typeorm-extension';
// import { DataSource } from 'typeorm';
// import { Workspaces } from '../../entities/Workspaces';
// import { Channels } from '../../entities/Channels';
//
// // 기본으로 회원이 생성될 때, 워크스페이스로 전환되기 때문에 데이터를 처음에 넣어주는 역할
// export default class UserSeeder implements Seeder {
//     public async run(
//         dataSource: DataSource,
//         factoryManager: SeederFactoryManager,
//     ): Promise<any> {
//         const workspacesRepository = dataSource.getRepository(Workspaces);
//         await workspacesRepository.insert([
//             {
//                 id: 1,
//                 name: 'Sleact',
//                 url: 'sleact',
//             },
//         ]);
//         const channelsRepository = dataSource.getRepository(Channels);
//         await channelsRepository.insert([
//             {
//                 id: 1,
//                 name: '일반',
//                 WorkspaceId: 1,
//                 private: false,
//             },
//         ]);
//     }
// }

import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Workspaces } from '../../entities/Workspaces';
import { Channels } from '../../entities/Channels';

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<any> {
        const workspacesRepository = dataSource.getRepository(Workspaces);
        const workspace = await workspacesRepository.save({
            name: 'Sleact',
            url: 'sleact',
        });

        const channelsRepository = dataSource.getRepository(Channels);
        await channelsRepository.save({
            name: '일반',
            Workspace: workspace, // Workspace 객체로 참조
            private: false,
        });
    }
}
