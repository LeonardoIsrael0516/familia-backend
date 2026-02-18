"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const configuration_1 = require("./common/config/configuration");
const database_module_1 = require("./common/database/database.module");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const auth_module_1 = require("./modules/auth/auth.module");
const health_module_1 = require("./modules/health/health.module");
const products_module_1 = require("./modules/products/products.module");
const content_module_1 = require("./modules/content/content.module");
const community_module_1 = require("./modules/community/community.module");
const admin_module_1 = require("./modules/admin/admin.module");
const devocional_module_1 = require("./modules/devocional/devocional.module");
const kit_module_1 = require("./modules/kit/kit.module");
const course_module_1 = require("./modules/course/course.module");
const badges_module_1 = require("./modules/badges/badges.module");
const user_progress_module_1 = require("./modules/user-progress/user-progress.module");
const notification_module_1 = require("./modules/notification/notification.module");
const storage_module_1 = require("./modules/storage/storage.module");
const webhook_module_1 = require("./modules/webhook/webhook.module");
const pwa_module_1 = require("./modules/pwa/pwa.module");
const push_module_1 = require("./modules/push/push.module");
const email_module_1 = require("./modules/email/email.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                useFactory: (config) => {
                    const ttl = config.get('throttle.ttlMs');
                    const limit = config.get('throttle.limit');
                    if (ttl == null || limit == null) {
                        throw new Error('THROTTLE_TTL_MS e THROTTLE_LIMIT são obrigatórios na .env');
                    }
                    return [{ ttl, limit }];
                },
                inject: [config_1.ConfigService],
            }),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            health_module_1.HealthModule,
            products_module_1.ProductsModule,
            content_module_1.ContentModule,
            community_module_1.CommunityModule,
            admin_module_1.AdminModule,
            devocional_module_1.DevocionalModule,
            kit_module_1.KitModule,
            course_module_1.CourseModule,
            badges_module_1.BadgesModule,
            user_progress_module_1.UserProgressModule,
            notification_module_1.NotificationModule,
            storage_module_1.StorageModule,
            webhook_module_1.WebhookModule,
            pwa_module_1.PwaModule,
            push_module_1.PushModule,
            email_module_1.EmailModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map