import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    // Burayý bu þekilde güncelle: create() adýmýný atlayýp direkt save() yapýyoruz
    // Bu sayede TypeScript dönüþ tipinden emin oluyor
    async create(userData: any): Promise<User> {
        const newUser = this.usersRepository.create(userData as User); // Tipini zorladýk
        return this.usersRepository.save(newUser);
    }

    async findOne(username: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { username } });
    }
}