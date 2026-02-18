import { PrismaService } from '../../common/database/prisma.service';
export declare class HealthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    check(): Promise<{
        status: string;
        database: string;
    }>;
}
