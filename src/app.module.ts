import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './common/config/configuration';
import { DatabaseModule } from './common/database/database.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { ProductsModule } from './modules/products/products.module';
import { ContentModule } from './modules/content/content.module';
import { CommunityModule } from './modules/community/community.module';
import { AdminModule } from './modules/admin/admin.module';
import { DevocionalModule } from './modules/devocional/devocional.module';
import { KitModule } from './modules/kit/kit.module';
import { CourseModule } from './modules/course/course.module';
import { BadgesModule } from './modules/badges/badges.module';
import { UserProgressModule } from './modules/user-progress/user-progress.module';
import { NotificationModule } from './modules/notification/notification.module';
import { StorageModule } from './modules/storage/storage.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { PwaModule } from './modules/pwa/pwa.module';
import { PushModule } from './modules/push/push.module';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const ttl = config.get<number>('throttle.ttlMs');
        const limit = config.get<number>('throttle.limit');
        if (ttl == null || limit == null) {
          throw new Error('THROTTLE_TTL_MS e THROTTLE_LIMIT são obrigatórios na .env');
        }
        return [{ ttl, limit }];
      },
      inject: [ConfigService],
    }),
    DatabaseModule,
    AuthModule,
    HealthModule,
    ProductsModule,
    ContentModule,
    CommunityModule,
    AdminModule,
    DevocionalModule,
    KitModule,
    CourseModule,
    BadgesModule,
    UserProgressModule,
    NotificationModule,
    StorageModule,
    WebhookModule,
    PwaModule,
    PushModule,
    EmailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
