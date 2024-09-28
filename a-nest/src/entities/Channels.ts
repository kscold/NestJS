// import {
//     Column,
//     CreateDateColumn,
//     Entity,
//     Index,
//     JoinColumn,
//     ManyToMany,
//     ManyToOne,
//     OneToMany,
//     PrimaryGeneratedColumn,
//     UpdateDateColumn,
// } from 'typeorm';
// import { ChannelChats } from './ChannelChats';
// import { ChannelMembers } from './ChannelMembers';
// import { Users } from './Users';
// import { Workspaces } from './Workspaces';
//
// @Index(['WorkspaceId'], {})
// @Entity()
// export class Channels {
//     @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
//     id: number;
//
//     @Column('varchar', { name: 'name', length: 30 })
//     name: string;
//
//     // @Column('tinyint', {
//     //     name: 'private',
//     //     nullable: true,
//     //     width: 1,
//     //     default: () => "'0'",
//     // })
//     // private: boolean | null;
//     // 'tinyint' 대신 'boolean' 사용, default 값은 'false'로 설정
//     @Column('boolean', {
//         name: 'private',
//         nullable: true,
//         default: false,
//     })
//     private: boolean | null;
//
//     @CreateDateColumn()
//     createdAt: Date;
//
//     @UpdateDateColumn()
//     updatedAt: Date;
//
//     @Column('int', { name: 'WorkspaceId', nullable: true })
//     WorkspaceId: number | null;
//
//     @OneToMany(() => ChannelChats, (channelchats) => channelchats.Channel)
//     ChannelChats: ChannelChats[];
//
//     @OneToMany(
//         () => ChannelMembers,
//         (channelMembers) => channelMembers.Channel,
//         {
//             cascade: ['insert'],
//         },
//     )
//     ChannelMembers: ChannelMembers[];
//
//     @ManyToMany(() => Users, (users) => users.Channels)
//     Members: Users[];
//
//     @ManyToOne(() => Workspaces, (workspaces) => workspaces.Channels, {
//         onDelete: 'SET NULL',
//         onUpdate: 'CASCADE',
//     })
//     @JoinColumn([{ name: 'WorkspaceId', referencedColumnName: 'id' }])
//     Workspace: Workspaces;
// }

import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { ChannelChats } from './ChannelChats';
import { ChannelMembers } from './ChannelMembers';
import { Users } from './Users';
import { Workspaces } from './Workspaces';

@Entity()
export class Channels {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('varchar', { name: 'name', length: 30 })
    name: string;

    @Column('boolean', { name: 'private', nullable: true, default: false })
    private: boolean | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // 외래 키 필드인 WorkspaceId는 제거
    @ManyToOne(() => Workspaces, (workspaces) => workspaces.Channels, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'WorkspaceId', referencedColumnName: 'id' }])
    Workspace: Workspaces;

    @OneToMany(() => ChannelChats, (channelchats) => channelchats.Channel)
    ChannelChats: ChannelChats[];

    @OneToMany(
        () => ChannelMembers,
        (channelMembers) => channelMembers.Channel,
        {
            cascade: ['insert'],
        },
    )
    ChannelMembers: ChannelMembers[];

    @ManyToMany(() => Users, (users) => users.Channels)
    Members: Users[];
}
