import { faker } from '@faker-js/faker';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { NOT_FOUND, returnedProduct, returnedProductExpanded } from './constants';
import { EnumProductsSort, GetAllProductsDto, ProductDto } from './dto/products.dto';
import { v4 as uuidv4 } from 'uuid';
import { PaginationService } from 'src/pagination/pagination.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pagination: PaginationService
  ) { }

  async getAll(dto: GetAllProductsDto) {
    const { sort, searchTerm } = dto
    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = []

    switch (sort) {
      case EnumProductsSort.HIGH_PRICE:
        prismaSort.push({ price: "desc" })
      case EnumProductsSort.LOW_PRICE:
        prismaSort.push({ price: "asc" })
      case EnumProductsSort.OLDEST:
        prismaSort.push({ createdAt: "desc" })
      default:
        prismaSort.push({ createdAt: "asc" })
    }

    const prismaSearch: Prisma.ProductWhereInput = searchTerm ? {
      OR: [
        {
          category: {
            name: { contains: searchTerm, mode: 'insensitive' }
          }
        },
        {
          name: {
            contains: searchTerm, mode: 'insensitive'
          }
        },
        {
          description: { contains: searchTerm, mode: 'insensitive' }
        }
      ]
    } : {}
    const { perPage, skip } = this.pagination.getPagination(dto)

    const products = await this.prisma.product.findMany({
      where: prismaSearch,
      orderBy: prismaSort,
      skip,
      take: perPage,
      select: returnedProductExpanded
    })
    return {
      products,
      length: await this.prisma.product.count({
        where: prismaSearch
      })
    }
  }

  async byFeature(id?: number, slug?: string) {
    const product = await this.prisma.product.findFirst({
      where: { OR: [{ id }, { slug }] },

      select: returnedProductExpanded
    })
    if (!product) {
      throw new NotFoundException(NOT_FOUND)
    }
    return product
  }

  async byCategory(categorySlug: string) {
    const product = await this.prisma.product.findMany({
      where: { category: { slug: categorySlug } },

      select: returnedProductExpanded
    })
    if (!product) {
      throw new NotFoundException(NOT_FOUND)
    }
    return product
  }

  async getSimilar(id: number) {
    const currentProduct = await this.byFeature(id, undefined)
    if (!currentProduct) {
      throw new NotFoundException(NOT_FOUND)
    }
    const products = await this.prisma.product.findMany({
      where: {
        category: { name: currentProduct.name },
        NOT: {
          id: currentProduct.id
        }
      },
      orderBy: { createdAt: "desc" },
      select: returnedProduct
    })
    return products
  }

  async create() {
    return await this.prisma.product.create({
      data: {
        name: "",
        slug: "",
        description: "",
        price: 0,
        categoryId: 0
      }
    })
  }

  async update(id: number, dto: ProductDto) {
    const { description, images, price, name, categoryId } = dto
    return await this.prisma.product.update({
      where: {
        id
      },
      data: {
        description,
        images,
        price,
        name,
        slug: faker.helpers.slugify(`${dto.name} ${uuidv4()}`),
        category: { connect: { id: +categoryId } }
      }
    })
  }

  async delete(id: number) {
    return await this.prisma.product.delete({
      where: { id }
    })
  }
}
