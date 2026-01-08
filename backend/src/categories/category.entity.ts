import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AppEvent } from '../events/event.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string; // Örn: Panel, Teknoloji, Workshop

    @OneToMany(() => AppEvent, (event) => event.category)
    events: AppEvent[];
}