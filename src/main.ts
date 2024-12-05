import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as moment from "moment-timezone";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { userConfig } from "./config";

function fetchArguments() {
  if (process.argv.length === 5) {
    userConfig.email = process.argv[2];
    userConfig.password = process.argv[3];
    userConfig.vehicleId = process.argv[4];
  }
}

async function bootstrap() {
  fetchArguments();
  const app = await NestFactory.create(AppModule, {
    logger: ["log", "error", "warn", "debug", "verbose", "fatal"],
    cors: true,
    snapshot: true,
  });
  moment.tz.setDefault("Poland");

  const config = new DocumentBuilder()
    .setTitle("Park Bot")
    .setVersion("1.0")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory);

  

  await app.listen(3000);
}
bootstrap();
