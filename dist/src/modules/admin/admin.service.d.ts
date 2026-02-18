import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { CreateAdminDto } from './dto/create-admin.dto';
export declare class AdminService {
    private readonly config;
    private readonly usersService;
    constructor(config: ConfigService, usersService: UsersService);
    createAdmin(dto: CreateAdminDto): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
    }>;
}
