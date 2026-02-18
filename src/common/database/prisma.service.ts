import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  onModuleInit() {
    // Não bloqueia a subida do app: conexão em background (evita travar se Supabase demorar/SSL).
    this.$connect().catch((err) => {
      console.error('[Prisma] Erro ao conectar no banco:', err?.message ?? err);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
