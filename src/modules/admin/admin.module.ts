import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminProductsController } from './admin-products.controller';
import { AdminPlansController } from './admin-plans.controller';
import { AdminUsersController } from './admin-users.controller';
import { AdminPlansService } from './admin-plans.service';
import { AdminUsersService } from './admin-users.service';
import { AdminGuard } from '../../common/guards/admin.guard';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [UsersModule, ProductsModule],
  controllers: [
    AdminController,
    AdminProductsController,
    AdminPlansController,
    AdminUsersController,
  ],
  providers: [AdminService, AdminGuard, AdminPlansService, AdminUsersService],
})
export class AdminModule {}
