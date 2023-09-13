import { PrismaService } from "./prisma.service";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService);
  const PORT = process.env.PORT || 4200
  await prismaService.enableShutdownHooks(app);
  app.setGlobalPrefix("api");
  app.enableCors();
  await app.listen(PORT);
}
bootstrap();
