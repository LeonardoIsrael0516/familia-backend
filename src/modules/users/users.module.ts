import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserProfileController } from './user-profile.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [UserProfileController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
