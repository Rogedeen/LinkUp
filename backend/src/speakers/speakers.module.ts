import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpeakersService } from './speakers.service';
import { SpeakersController } from './speakers.controller';
import { Speaker } from './speaker.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Speaker])],
    controllers: [SpeakersController],
    providers: [SpeakersService],
})
export class SpeakersModule { }