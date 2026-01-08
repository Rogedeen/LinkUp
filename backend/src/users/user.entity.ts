import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Attendance } from '../events/attendance.entity'; // Attendance'ı import etmeyi unutma!

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

    @Column({ type: 'simple-enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    // HATA ÇÖZÜMÜ: User tarafındaki eksik bağlantı
    @OneToMany(() => Attendance, (attendance) => attendance.user)
    attendances: Attendance[];
}