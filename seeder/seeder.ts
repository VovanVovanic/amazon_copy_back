/* eslint-disable prettier/prettier */
import { getRandomNumber } from './../utils/generateRandomNumber';
import { generateSlug } from './../utils/generateSlug';
import { faker } from '@faker-js/faker';
import { PrismaClient, Product } from '@prisma/client';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
dotenv.config();
const prisma = new PrismaClient();

const createProduct = async (amount: number) => {
  const products: Product[] = [];

  for (let i = 0; i <= amount; i++) {
    const productName = faker.commerce.productName();
    const categoryName = faker.commerce.department();
    const categorySlug = `${categoryName} ${uuidv4()}`;

    const product = await prisma.product.create({
      data: {
        name: productName,
        slug: faker.helpers.slugify(productName),
        description: faker.commerce.productDescription(),
        price: +faker.commerce.price({ min: 1, max: 100 }),
        images: Array.from({ length: getRandomNumber(1, 6) }).map(() =>
          faker.image.url(),
        ),
        // category: {
        //   create: {
        //     name: categoryName,
        //     slug: faker.helpers.slugify(categorySlug),
        //   },
        // },
        //user: { connect: { id: 4 } },
        category:{connect:{id:12}},
        reviews: {
          create: [
            {
              rating: faker.number.int({ min: 1, max: 5 }),
              text: faker.lorem.paragraph(),
              user: { connect: { id: 1 } },
            },
            {
              rating: faker.number.int({ min: 1, max: 5 }),
              text: faker.lorem.paragraph(),
              user: { connect: { id: 1 } },
            },
            {
              rating: faker.number.int({ min: 1, max: 5 }),
              text: faker.lorem.paragraph(),
              user: { connect: { id: 1 } },
            },
          ],
        },
      },
    });
    products.push(product);
  }
};

const main = async () => {
  await createProduct(10);
};

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
