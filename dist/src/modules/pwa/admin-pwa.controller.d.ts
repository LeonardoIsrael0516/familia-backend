import { PwaService } from './pwa.service';
import { UpdatePwaSettingsDto } from './dto/update-pwa-settings.dto';
export declare class AdminPwaController {
    private readonly pwaService;
    constructor(pwaService: PwaService);
    getSettings(): Promise<import("./pwa.service").PwaConfig>;
    updateSettings(dto: UpdatePwaSettingsDto): Promise<import("./pwa.service").PwaConfig>;
}
