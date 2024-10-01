// import {
//     Column,
//     CreateDateColumn,
//     Entity,
//     Index,
//     JoinColumn,
//     ManyToOne,
//     PrimaryGeneratedColumn,
//     UpdateDateColumn,
// } from 'typeorm';
// import { Users } from './Users';
// import { Channels } from './Channels';
//
// @Index('UserId', ['UserId'], {})
// @Index('ChannelId', ['ChannelId'], {})
// @Entity({ schema: 'sleact', name: 'channelchats' })
// export class ChannelChats {
//     @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
//     id: number;
//
//     @Column('text', { name: 'content' })
//     content: string;
//
//     @CreateDateColumn()
//     createdAt: Date;
//
//     @UpdateDateColumn()
//     updatedAt: Date;
//
//     @Column('int', { name: 'UserId', nullable: true })
//     UserId: number | null;
//
//     @Column('int', { name: 'ChannelId', nullable: true })
//     ChannelId: number | null;
//
//     @ManyToOne(() => Users, (users) => users.ChannelChats, {
//         onDelete: 'SET NULL',
//         onUpdate: 'CASCADE',
//     })
//     @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
//     User: Users;
//
//     @ManyToOne(() => Channels, (channels) => channels.ChannelChats, {
//         onDelete: 'SET NULL',
//         onUpdate: 'CASCADE',
//     })
//     @JoinColumn([{ name: 'ChannelId', referencedColumnName: 'id' }])
//     Channel: Channels;
// }

import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users';
import { Channels } from './Channels';

// @Index('UserId', ['UserId'], {})
@Index('IDX_ChannelChats_UserId', ['UserId'], {}) // 인덱스 이름 변경
@Index('ChannelId', ['ChannelId'], {})
@Entity({ schema: 'public', name: 'channelchats' })
export class ChannelChats {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('text', { name: 'content' })
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column('int', { name: 'UserId', nullable: true })
    UserId: number | null;

    @Column('int', { name: 'ChannelId', nullable: true })
    ChannelId: number | null;

    @ManyToOne(() => Users, (users) => users.ChannelChats, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
    User: Users;

    @ManyToOne(() => Channels, (channels) => channels.ChannelChats, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'ChannelId', referencedColumnName: 'id' }])
    Channel: Channels;
}
