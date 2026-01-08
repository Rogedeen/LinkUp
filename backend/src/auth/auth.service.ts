import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(userDto: any) {
        const { email, password, username, role } = userDto;
        const hashedPassword = await bcrypt.hash(password, 10);

        return this.usersService.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        });
    }

    async login(username: string, pass: string) {
        const user = await this.usersService.findOne(username);
        if (user && await bcrypt.compare(pass, user.password)) {
            const payload = { username: user.username, sub: user.id, role: user.role };
            return {
                access_token: this.jwtService.sign(payload),
                role: user.role,
                username: user.username,
                id: user.id,
            };
        }
        throw new UnauthorizedException('Giriş başarısız!');
    }
}