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

    // Bire-Çok İlişki (1:N): Bir konuşmacı birden fazla etkinliğe katılabilir 
    @OneToMany(() => AppEvent, (event) => event.speaker)
    events: AppEvent[];
}