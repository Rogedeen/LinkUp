import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Attendance } from '../events/attendance.entity';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'katilimci',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: 'user' })
    role: string;

    @OneToMany(() => Attendance, (attendance) => attendance.user)
    attendances: Attendance[];
}