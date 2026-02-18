import { UsersService } from './users.service';
import { StorageService } from '../storage/storage.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordCurrentUserDto } from './dto/change-password-current-user.dto';
export declare class UserProfileController {
    private readonly usersService;
    private readonly storage;
    constructor(usersService: UsersService, storage: StorageService);
    getProfile(userId: string): Promise<import("./users.service").UserSafe | null>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<import("./users.service").UserSafe>;
    changePassword(userId: string, dto: ChangePasswordCurrentUserDto): Promise<void>;
    avatarUpload(userId: string, file: {
        fieldname: string;
        originalname: string;
        mimetype: string;
        buffer: Buffer;
        size: number;
    }): Promise<{
        url: string;
    }>;
}
