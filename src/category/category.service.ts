/* eslint-disable prettier/prettier */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ALREADY_EXIST, NOT_FOUND, returnedCategory } from "./constants";
import { CreateCategoryDto } from "./dto/createCategory.dto";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async byFeature(id?: number, slug?: string) {
    const category = await this.prisma.category.findFirst({
      where: { OR: [{ id }, { slug }] },

      select: returnedCategory,
    });
    if (!category) {
      throw new NotFoundException(NOT_FOUND);
    }
    return category;
  }

  async getAll() {
    return await this.prisma.category.findMany({
      select: returnedCategory,
    });
  }

  async create(dto: CreateCategoryDto) {
    const category = await this.prisma.category.findFirst({
      where: { name: dto.name },
    });

    if (category) throw new ForbiddenException(ALREADY_EXIST);
    else {
      return await this.prisma.category.create({
        data: {
          ...dto,
          slug: faker.helpers.slugify(`${dto.name} ${uuidv4()}`),
        },
      });
    }
  }

  async update(id: number, dto: CreateCategoryDto) {
    const category = await this.byFeature(id, undefined);
    return await this.prisma.category.update({
      where: {
        id: category.id,
      },
      data: {
        name: dto.name,
        slug: faker.helpers.slugify(`${dto.name} ${uuidv4()}`),
      },
    });
  }

  async delete(id: number) {
    return await this.prisma.category.delete({
      where: { id },
    });
  }
}
