import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { AppEvent } from './event.entity';
import { Attendance } from './attendance.entity';
import { User } from '../users/user.entity'; 

@Module({
    imports: [
        TypeOrmModule.forFeature([AppEvent, Attendance, User])
    ],
    controllers: [EventsController],
    providers: [EventsService],
    exports: [EventsService]
})
export class EventsModule { }