import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SpeakersModule } from './speakers/speakers.module';
import { EventsModule } from './events/events.module';
import { CategoriesModule } from './categories/categories.module'; // Varsa ekle

import { User } from './users/user.entity';
import { Speaker } from './speakers/speaker.entity';
import { AppEvent } from './events/event.entity';
import { Category } from './categories/category.entity';
import { Attendance } from './events/attendance.entity'; // BURAYI EKLE!

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'db.sqlite',
            // HATA BURADAYDI: Attendance listeye eklendi
            entities: [User, Speaker, AppEvent, Category, Attendance],
            synchronize: true,
        }),
        AuthModule,
        UsersModule,
        SpeakersModule,
        EventsModule,
        CategoriesModule, // Eğer oluşturduysan aktif et
    ],
})
export class AppModule { }