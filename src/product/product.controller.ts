import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { GetAllProductsDto, ProductDto } from './dto/products.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }
  
  @Get()
  @UsePipes(new ValidationPipe)
  async getAll(@Query() queryDto: GetAllProductsDto) {
    return this.productService.getAll(queryDto)
  }

  @Get('similar/:id')
  async getSimilar(@Param('id') id:string) {
    return this.productService.getSimilar(+id)
  }

  @Get('by_id/:id')
  async getById(@Param('id')id:string ) {
    return await this.productService.byFeature(+id)
  }
  @Get('by_slug/:slug')
  async getBySlug(@Param('slug')slug:string ) {
    return await this.productService.byFeature(undefined, slug)
  }
  @Get('by_scategory/:slug')
  async getByCategory(@Param('slug')slug:string ) {
   return await this.productService.byCategory(slug)  
}
  @Post('create')
  @HttpCode(200)
  @Auth()
  async create() {
    return this.productService.create()
  }

  @Delete('delete/:id')
  @HttpCode(200)
  @Auth()
  async delete(@Param('id') id:string) {
    return this.productService.delete(+id)
  }

  @Put("update/:id")
  @HttpCode(200)
  @Auth()
  async update(@Param('id') id:string, @Body() dto:ProductDto) {
    return this.productService.update(+id, dto)
  }
}
