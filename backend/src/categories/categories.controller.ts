import { Controller, Get, Post, Delete, Body, Param, Patch } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() { return this.categoriesService.findAll(); }

  @Post()
  create(@Body() body: any) { return this.categoriesService.create(body); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.categoriesService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}