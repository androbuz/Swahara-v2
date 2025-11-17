import { Global, Module, OnModuleInit } from '@nestjs/common';
import { MetadataScannerService } from './services/metadata-scanner/metadata-scanner.service';
import { PermissionSeederService } from './services/permission-seeder/permission-seeder.service';
import { DiscoveryModule } from '@nestjs/core';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [MetadataScannerService, PermissionSeederService],
  exports: [MetadataScannerService, PermissionSeederService],
})
export class PermissionsModule implements OnModuleInit {
  constructor(private readonly permissionSeeder: PermissionSeederService) {}

  async onModuleInit() {
    const isInSync = await this.permissionSeeder.performSanityCheck();

    if (!isInSync) {
      await this.permissionSeeder.seedPermissions();
    }
  }
}
