import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as moment from "moment-timezone";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["log", "error", "warn", "debug", "verbose", "fatal"],
    cors: true,
    snapshot: true,
  });
  moment.tz.setDefault("Poland");
  await app.listen(3000);
}
bootstrap();
