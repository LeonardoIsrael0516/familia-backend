"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    const port = config.get('port');
    const corsOrigin = config.get('cors.origin');
    if (port == null || Number.isNaN(port)) {
        throw new Error('Variável de ambiente PORT é obrigatória (ex.: 3000).');
    }
    if (!corsOrigin) {
        throw new Error('Variável de ambiente CORS_ORIGIN é obrigatória (ex.: http://localhost:8080).');
    }
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: corsOrigin,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map