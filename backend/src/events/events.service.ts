import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppEvent } from './event.entity';
import { Attendance } from './attendance.entity';
import { User } from '../users/user.entity';


@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(AppEvent)
        private readonly repo: Repository<AppEvent>,
        @InjectRepository(Attendance)
        private readonly attendanceRepo: Repository<Attendance>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async findAll() {
        return await this.repo.find({ relations: ['speaker', 'category'] });
    }

    async create(createEventDto: any) {
        const { speakerId, categoryId, ...eventData } = createEventDto;

        // TypeORM create işlemi
        const newEvent = (this.repo.create(eventData as object) as unknown) as AppEvent;

        // İlişkileri kur
        if (speakerId) newEvent.speaker = { id: Number(speakerId) } as any;
        if (categoryId) newEvent.category = { id: Number(categoryId) } as any;

        // HATAYI ÇÖZEN KISIM: Eğer tarih veya konum boşsa varsayılan değer ata
        if (!newEvent.date) {
            newEvent.date = new Date().toISOString().split('T')[0]; // Bugünün tarihi (YYYY-MM-DD)
        }
        if (!newEvent.location) {
            newEvent.location = "Belirtilmemiş / Online";
        }

        return await this.repo.save(newEvent);
    }

    async update(id: number, updateEventDto: any) {
        const { speakerId, categoryId, ...updateData } = updateEventDto;
        const event = await this.repo.findOne({ where: { id } });
        if (!event) throw new NotFoundException('Etkinlik bulunamadı');

        Object.assign(event, updateData);

        if (speakerId) event.speaker = { id: parseInt(speakerId) } as any;
        if (categoryId) event.category = { id: parseInt(categoryId) } as any;

        return await this.repo.save(event);
    }

    async remove(id: number) {
        try {
            await this.attendanceRepo.delete({ event: { id: id } });
            return await this.repo.delete(id);
        } catch (error) {
            throw new InternalServerErrorException('Silme hatası.');
        }
    }

    async joinEvent(eventId: number, userId: number) {
        const existing = await this.attendanceRepo.findOne({
            where: { event: { id: eventId }, user: { id: userId } }
        });

        // EĞER VARSA HATA FIRLAT
        if (existing) {
            throw new ConflictException('Bu etkinliğe zaten kayıtlısınız.');
        }

        const attendance = this.attendanceRepo.create({
            event: { id: eventId } as any,
            user: { id: userId } as any
        });
        return await this.attendanceRepo.save(attendance);
    }

    async leaveEvent(eventId: number, userId: number) {
        return await this.attendanceRepo.delete({
            event: { id: eventId },
            user: { id: userId }
        });
    }

    async getMyEvents(userId: number) {
        const records = await this.attendanceRepo.find({
            where: { user: { id: userId } },
            relations: ['event', 'event.speaker', 'event.category']
        });
        return records.map(r => r.event);
    }
}