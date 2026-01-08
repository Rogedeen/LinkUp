import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SpeakersModule } from './speakers/speakers.module';
import { EventsModule } from './events/events.module';
import { CategoriesModule } from './categories/categories.module'; 

import { User } from './users/user.entity';
import { Speaker } from './speakers/speaker.entity';
import { AppEvent } from './events/event.entity';
import { Category } from './categories/category.entity';
import { Attendance } from './events/attendance.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'db.sqlite',
            entities: [User, Speaker, AppEvent, Category, Attendance],
            synchronize: true,
        }),
        AuthModule,
        UsersModule,
        SpeakersModule,
        EventsModule,
        CategoriesModule, 
    ],
})
export class AppModule { }