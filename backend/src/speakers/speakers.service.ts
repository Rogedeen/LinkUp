import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Speaker } from './speaker.entity';

@Injectable()
export class SpeakersService {
    constructor(@InjectRepository(Speaker) private repo: Repository<Speaker>) { }

    findAll() { return this.repo.find(); }
    create(data: any) { return this.repo.save(this.repo.create(data)); }
    remove(id: number) { return this.repo.delete(id); }

    // Servislerin içindeki update metodu
    async update(id: number, data: any) {
        // Önce id ile veriyi bulup üzerine gelen yeni veriyi yazıyoruz
        await this.repo.update(id, data);
        // Güncel halini geri döndürüyoruz
        return this.repo.findOne({ where: { id } as any });
    }
}