import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AppEvent } from '../events/event.entity';

@Entity()
export class Speaker {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column({ nullable: true })
    bio: string;

    @Column()
    expertise: string;

    @OneToMany(() => AppEvent, (event) => event.speaker)
    events: AppEvent[];
}