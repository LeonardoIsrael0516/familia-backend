import { PushService } from './push.service';
import { SendPushDto } from './dto/send-push.dto';
export declare class AdminPushController {
    private readonly pushService;
    constructor(pushService: PushService);
    sendToAll(dto: SendPushDto): Promise<{
        sent: number;
        total: number;
    }>;
}
