import { PwaService } from './pwa.service';
import { ConfigService } from '@nestjs/config';
export declare class PwaController {
    private readonly pwaService;
    private readonly config;
    constructor(pwaService: PwaService, config: ConfigService);
    getConfig(): Promise<import("./pwa.service").PwaConfig>;
    getManifest(): Promise<Record<string, unknown>>;
}
