import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // BU SATIR KRÝTÝK: Frontend'den gelen isteklere kapýyý açar
    app.enableCors();

    await app.listen(3000);
}
bootstrap();