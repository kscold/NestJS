// import { DataSource } from 'typeorm';
// import dotenv from 'dotenv';
//
// import { ChannelChats } from './entities/ChannelChats';
// import { ChannelMembers } from './entities/ChannelMembers';
// import { Channels } from './entities/Channels';
// import { DMs } from './entities/DMs';
// import { Mentions } from './entities/Mentions';
// import { Users } from './entities/Users';
// import { WorkspaceMembers } from './entities/WorkspaceMembers';
// import { Workspaces } from './entities/Workspaces';
//
// dotenv.config();
//
// const dataSource = new DataSource({
//     type: 'postgres',
//     host: 'localhost',
//     port: 5432,
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     entities: [
//         ChannelChats,
//         ChannelMembers,
//         Channels,
//         DMs,
//         Mentions,
//         Users,
//         WorkspaceMembers,
//         Workspaces,
//     ],
//     migrations: [`${__dirname}/src/migrations/*.ts`], // Ensure the path is correct
//     synchronize: false,
//     logging: true,
// });
//
// export default dataSource;

import { DataSource } from 'typeorm';
import { ChannelChats } from './entities/ChannelChats';
import { ChannelMembers } from './entities/ChannelMembers';
import { Channels } from './entities/Channels';
import { DMs } from './entities/DMs';
import { Mentions } from './entities/Mentions';
import { Users } from './entities/Users';
import { WorkspaceMembers } from './entities/WorkspaceMembers';
import { Workspaces } from './entities/Workspaces';
import * as dotenv from 'dotenv';

// dotenv로 환경 변수 로드
dotenv.config();

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'vnsxk1022!',
    database: process.env.DB_DATABASE || 'sleact',
    entities: [
        ChannelChats,
        ChannelMembers,
        Channels,
        DMs,
        Mentions,
        Users,
        WorkspaceMembers,
        Workspaces,
    ],
    migrations: [`${__dirname}/migrations/*.ts`],
    synchronize: false,
    logging: true,
});

export default dataSource;
