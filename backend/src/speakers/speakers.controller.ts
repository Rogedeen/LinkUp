import { Controller, Get, Post, Delete, Body, Param, Patch } from '@nestjs/common'; // Patch eklendi
import { SpeakersService } from './speakers.service';

@Controller('speakers')
export class SpeakersController {
    constructor(private service: SpeakersService) { }

    @Get() findAll() { return this.service.findAll(); }
    @Post() create(@Body() body: any) { return this.service.create(body); }
    @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(+id); }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.service.update(+id, body);
    }
}