import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    createAdmin(dto: CreateAdminDto): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
    }>;
}
