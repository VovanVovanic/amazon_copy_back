/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CategoryService } from 'src/category/category.service';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import {
  NOT_FOUND,
  returnedProductExpanded
} from './constants';
import { CreateProductDto } from './dto/createProduct.dto';
import {
  EnumProductsSort,
  GetAllProductsDto,
  ProductDto,
} from './dto/products.dto';
import { convertToNumber } from './utils';
@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pagination: PaginationService,
    private readonly categoryService: CategoryService,
  ) { }

  async getAll(dto: GetAllProductsDto) {
    const { perPage, skip } = this.pagination.getPagination(dto);

    const filters = this.createFilters(dto);
    const products = await this.prisma.product.findMany({
      where: filters,
      orderBy: this.getSortOptions(dto.sort),
      skip,
      take: perPage,
      select: returnedProductExpanded,
    });
    console.log(products.length, perPage, "prod")
    return {
      products,
      length: await this.prisma.product.count({
        where: filters,
      }),
    };
  }

  private createFilters(dto: GetAllProductsDto): Prisma.ProductWhereInput {
    const filters: Prisma.ProductWhereInput[] = [];
    if (dto.searchTerm) filters.push(this.getSearchTermFilter(dto.searchTerm));
    if (dto.ratings)
      filters.push(
        this.getRatingsFilter(dto.ratings.split('|').map((el) => +el)),
      );
    if (dto.categoryId) filters.push(this.getCategoryFilters(+dto.categoryId));
    if (dto.minPrice || dto.maxPrice)
      filters.push(
        this.getPriceFilters(
          convertToNumber(dto.minPrice),
          convertToNumber(dto.maxPrice),
        ),
      );

    return filters.length ? { AND: filters } : {};
  }

  private getCategoryFilters(
    categoryId: number,
  ): Prisma.ProductScalarWhereInput {
    return { categoryId };
  }

  private getSortOptions(
    sort: EnumProductsSort,
  ): Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
      case EnumProductsSort.HIGH_PRICE:
        return [{ price: 'desc' }];
      case EnumProductsSort.LOW_PRICE:
        return [{ price: 'asc' }];
      case EnumProductsSort.OLDEST:
        return [{ createdAt: 'desc' }];
      default:
        return [{ createdAt: 'asc' }];
    }
  }

  private getSearchTermFilter(searchTerm: string): Prisma.ProductWhereInput {
    return {
      OR: [
        {
          category: {
            name: { contains: searchTerm, mode: 'insensitive' },
          },
        },
        {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          description: { contains: searchTerm, mode: 'insensitive' },
        },
      ],
    };
  }

  private getRatingsFilter(ratings: number[]): Prisma.ProductWhereInput {
    return {
      averageRating: {
        in: ratings,
      },
    };
  }

  private getPriceFilters(
    min?: number,
    max?: number,
  ): Prisma.ProductWhereInput {
    let priceFilter: Prisma.IntFilter | undefined = undefined;
    if (min) {
      priceFilter = { ...priceFilter, gte: min };
    }

    if (max) {
      priceFilter = { ...priceFilter, lte: max };
    }
    return { price: priceFilter };
  }

  async byFeature(id?: number, slug?: string) {
    console.log(id, "idid")
    const product = await this.prisma.product.findFirst({
      where: { OR: [{ id }, { slug }] },

      select: returnedProductExpanded,
    });
    if (!product) {
      throw new NotFoundException(NOT_FOUND);
    }
    return product;
  }

  async byCategory(categorySlug: string, sort: EnumProductsSort = EnumProductsSort.NEWEST) {
    const product = await this.prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      orderBy: this.getSortOptions(sort),
      select: returnedProductExpanded,
    });
    if (!product) {
      throw new NotFoundException(NOT_FOUND);
    }
    return product;
  }

  async getSimilar(id: number) {
    const currentProduct = await this.byFeature(id, undefined);
    if (!currentProduct) {
      throw new NotFoundException(NOT_FOUND);
    }
    const products = await this.prisma.product.findMany({
      where: {
        category: { name: currentProduct.category.name },
        NOT: {
          id: currentProduct.id,
        },
      },
      orderBy: { createdAt: 'desc' },
      select: returnedProductExpanded,
    });
    return products;
  }

  async create(dto: CreateProductDto) {
    const { name, description, price, categoryId } = dto

    return await this.prisma.product.create({
      data: {
        name,
        slug: faker.helpers.slugify(`${name} ${uuidv4()}`),
        description,
        price: +price,
        categoryId: +categoryId
      },
    });
  }

  async update(id: number, dto: ProductDto) {
    const { description, price, name, categoryId } = dto
    const product = this.prisma.product.update({
      where: {
        id,
      },
      data: {
        description,
        price: +price,
        name,
        slug: faker.helpers.slugify(`${dto.name} ${uuidv4()}`),
        category: { connect: { id: +categoryId } },
      },
    });
    return product
  }

  async delete(id: number) {
    return await this.prisma.product.delete({
      where: { id },
    });
  }
}
