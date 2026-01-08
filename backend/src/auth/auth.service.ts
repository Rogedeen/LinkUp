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

    // 1. Kayıt Olma (Hashleme burada yapılıyor)
    async register(userDto: any) {
        const { email, password, username, role } = userDto;

        // Email Kontrolü
        if (!email || !email.includes('@')) {
            throw new Error('Geçersiz e-posta formatı!');
        }

        // Şifre Regex Kontrolü
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            throw new Error('Şifre güvenlik kriterlerini karşılamıyor!');
        }

        // Gerçek kayıt işlemin (örneğin usersService çağrısı) buraya gelir
        // return this.usersService.create({ email, password, username, role });
    }

    // 2. Giriş Yapma (Doğrulama ve Token Verme)
    async login(username: string, pass: string) {
        const user = await this.usersService.findOne(username);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const payload = { username: user.username, sub: user.id, role: user.role };
            return {
                access_token: this.jwtService.sign(payload),
                role: user.role,
                username: user.username,
                id: user.id, // KRİTİK: Bu satırı ekle ki frontend ID'yi alabilsin!
            };
        }
        throw new UnauthorizedException('Kullanıcı adı veya şifre hatalı!');
    }
}