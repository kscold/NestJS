// import {
//     Column,
//     CreateDateColumn,
//     Entity,
//     Index,
//     JoinColumn,
//     ManyToOne,
//     UpdateDateColumn,
// } from 'typeorm';
// import { Channels } from './Channels';
// import { Users } from './Users';
//
// @Index('UserId', ['UserId'], {})
// @Entity({ schema: 'sleact', name: 'channelmembers' })
// export class ChannelMembers {
//     @CreateDateColumn()
//     createdAt: Date;
//
//     @UpdateDateColumn()
//     updatedAt: Date;
//
//     @Column('int', { primary: true, name: 'ChannelId' })
//     ChannelId: number;
//
//     @Column('int', { primary: true, name: 'UserId' })
//     UserId: number;
//
//     @ManyToOne(() => Channels, (channels) => channels.ChannelMembers, {
//         onDelete: 'CASCADE',
//         onUpdate: 'CASCADE',
//     })
//     @JoinColumn([{ name: 'ChannelId', referencedColumnName: 'id' }])
//     Channel: Channels;
//
//     @ManyToOne(() => Users, (users) => users.ChannelMembers, {
//         onDelete: 'CASCADE',
//         onUpdate: 'CASCADE',
//     })
//     @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
//     User: Users;
// }

import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    UpdateDateColumn,
} from 'typeorm';
import { Channels } from './Channels';
import { Users } from './Users';

// @Index('UserId', ['UserId'], {})
@Index('IDX_ChannelMembers_UserId', ['UserId'], {}) // 인덱스 이름 변경
@Entity({ schema: 'public', name: 'channelmembers' })
export class ChannelMembers {
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column('int', { primary: true, name: 'ChannelId' })
    ChannelId: number;

    @Column('int', { primary: true, name: 'UserId' })
    UserId: number;

    @ManyToOne(() => Channels, (channels) => channels.ChannelMembers, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'ChannelId', referencedColumnName: 'id' }])
    Channel: Channels;

    @ManyToOne(() => Users, (users) => users.ChannelMembers, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
    User: Users;
}
