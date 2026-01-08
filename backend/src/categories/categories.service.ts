import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly repo: Repository<Category>,
    ) { }

    findAll() { return this.repo.find(); }

    create(body: any) { return this.repo.save(this.repo.create(body)); }

    async update(id: number, body: any) {
        await this.repo.update(id, body);
        return this.repo.findOne({ where: { id } });
    }

    remove(id: number) { return this.repo.delete(id); }
}