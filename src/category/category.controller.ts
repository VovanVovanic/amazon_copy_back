/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get()
  async getAll() {
    return await this.categoryService.getAll()
  }
  @Get('by_id/:id/:sort')
  async getById(@Param('id') id: string, @Param('sort') sort: string) {
    return await this.categoryService.byFeature(+id, undefined)
  }
  @Get('by_slug/:slug/:sort')
  @UsePipes(new ValidationPipe)
  async getBySlug(@Param('slug') slug: string, @Param('sort') sort: string) {
    return await this.categoryService.byFeature(undefined, slug)
  }

  @Post('create')
  @HttpCode(200)
  @Auth('admin')
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto)
  }


  @Put("update/:id")
  @HttpCode(200)
  @Auth('admin')
  async update(@Param('id') id: string, @Body() dto: CreateCategoryDto) {
    return this.categoryService.update(+id, dto)
  }

  @Delete('delete/:id')
  @HttpCode(200)
  @Auth('admin')
  async delete(@Param('id') id: string) {
    return this.categoryService.delete(+id)
  }
}
