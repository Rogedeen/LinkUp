import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { AppEvent } from './event.entity';

@Entity()
export class Attendance {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    registrationDate: Date;

    @ManyToOne(() => User, (user) => user.attendances)
    user: User;

    @ManyToOne(() => AppEvent, (event) => event.attendances)
    event: AppEvent;
}