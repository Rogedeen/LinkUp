import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Speaker } from '../speakers/speaker.entity';
import { Category } from '../categories/category.entity';
import { Attendance } from './attendance.entity';

@Entity()
export class AppEvent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    date: string;

    @Column()
    location: string;

    @ManyToOne(() => Speaker, (speaker) => speaker.events, { onDelete: 'SET NULL' })
    speaker: Speaker;

    @ManyToOne(() => Category, (category) => category.events, { onDelete: 'SET NULL' })
    category: Category;

    @OneToMany(() => Attendance, (attendance) => attendance.event)
    attendances: Attendance[];
}