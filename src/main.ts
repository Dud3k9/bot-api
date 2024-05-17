import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["log", "error", "warn", "debug", "verbose", "fatal"],
    cors: true,
    snapshot: true,
  });
  await app.listen(3000);
}
bootstrap();
