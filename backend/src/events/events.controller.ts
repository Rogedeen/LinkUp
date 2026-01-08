import { Controller, Get, Post, Delete, Body, Param, Patch } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
    constructor(private readonly service: EventsService) { }

    @Get()
    findAll() { return this.service.findAll(); }

    @Post()
    create(@Body() body: any) { return this.service.create(body); }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.service.update(+id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(Number(id));
    }

    @Post(':id/join')
    join(@Param('id') id: string, @Body('userId') userId: number) {
        return this.service.joinEvent(+id, userId);
    }

    @Post(':id/leave')
    leave(@Param('id') id: string, @Body('userId') userId: number) {
        return this.service.leaveEvent(+id, userId);
    }

    @Get('my/:userId')
    getMyEvents(@Param('userId') userId: string) {
        return this.service.getMyEvents(+userId);
    }
}