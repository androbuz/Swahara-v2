import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../../shared/database/service/database.service';
import { MetadataScannerService } from '../metadata-scanner/metadata-scanner.service';
import { FeatureMetadata } from '../../decorators/feature.decorator';
import { PermissionMetadata } from '../../decorators/permission.decorator';

@Injectable()
export class PermissionSeederService {
  private readonly logger = new Logger(PermissionSeederService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly metadataScanner: MetadataScannerService,
  ) {}

  async seedPermissions(): Promise<void> {
    this.logger.log('Starting permissions seeding...');
    const scannedFeatures = this.metadataScanner.scanFeatures();

    const existingFeatures = await this.db.feature.findMany({
      include: { permissions: true },
    });

    const processedFeatureKeys = new Set<string>();
    const processedPermissionKeys = new Set<string>();

    for (const { feature, permissions, viewPermission } of scannedFeatures) {
      const {
        key: featureKey,
        description: featureDescription,
        name: featureName,
      }: FeatureMetadata = feature;
      processedFeatureKeys.add(featureKey);

      const dbFeature = await this.db.feature.upsert({
        where: { key: featureKey },
        update: {
          name: featureDescription,
          description: featureDescription,
        },
        create: {
          key: featureKey,
          name: featureName,
          description: featureDescription,
        },
      });

      this.logger.log(`Processed feature:${featureKey}`);

      if (viewPermission) {
        processedPermissionKeys.add(viewPermission.key);

        await this.db.permission.upsert({
          where: { key: viewPermission.key },
          update: {
            description: viewPermission.description,
            featureId: dbFeature.id,
            isModulePermission: true,
          },
          create: {
            key: viewPermission.key,
            name: this.generatePermissionName(viewPermission.key),
            description: viewPermission.description,
            featureId: dbFeature.id,
            isModulePermission: true,
          },
        });

        this.logger.log(`✓ Module VIEW permission: ${viewPermission.key}`);
      }

      for (const permission of permissions) {
        const {
          key: permissionKey,
          description: permissionDescription,
        }: PermissionMetadata = permission;

        processedPermissionKeys.add(permissionKey);

        await this.db.permission.upsert({
          where: { key: permissionKey },
          update: {
            description: permissionDescription,
            featureId: dbFeature.id,
            isModulePermission: false,
          },
          create: {
            key: permissionKey,
            name: this.generatePermissionName(permissionKey),
            description: permissionDescription,
            featureId: dbFeature.id,
            isModulePermission: false,
          },
        });

        this.logger.log(` --> Processed permission:${permissionKey}`);
      }
    }

    const orphanedFeatures = existingFeatures.filter(
      (feature) => !processedFeatureKeys.has(feature.key),
    );

    if (orphanedFeatures.length > 0) {
      this.logger.warn(
        `Found ${orphanedFeatures.length} orphaned features in database:`,
      );

      for (const feature of orphanedFeatures) {
        await this.db.feature.update({
          where: { id: feature.id },
          data: { isOrphaned: true },
        });
        this.logger.warn(
          `  - ${feature.key}: ${feature.name} (marked as orphaned)`,
        );
      }
    }

    const reactivatedFeatures = existingFeatures.filter(
      (f) => f.isOrphaned && processedFeatureKeys.has(f.key),
    );

    if (reactivatedFeatures.length > 0) {
      this.logger.log(
        `Found ${reactivatedFeatures.length} features that are no longer orphaned:`,
      );

      for (const feature of reactivatedFeatures) {
        await this.db.feature.update({
          where: { id: feature.id },
          data: { isOrphaned: false },
        });

        this.logger.log(`  ✓ ${feature.key}: ${feature.name} (reactivated)`);
      }
    }

    const allExistingPermissions = existingFeatures.flatMap(
      (feature) => feature.permissions,
    );

    const orphanedPermissions = allExistingPermissions.filter(
      (permission) => !processedPermissionKeys.has(permission.key),
    );

    if (orphanedPermissions.length > 0) {
      this.logger.warn(
        `Found ${orphanedPermissions.length} orphaned permissions in database:`,
      );

      for (const permission of orphanedPermissions) {
        await this.db.permission.update({
          where: { id: permission.id },
          data: { isOrphaned: true },
        });
        this.logger.warn(
          `  - ${permission.key}: ${permission.name} (marked as orphaned)`,
        );
      }
    }

    const reactivatedPermissions = allExistingPermissions.filter(
      (p) => p.isOrphaned && processedPermissionKeys.has(p.key),
    );

    if (reactivatedPermissions.length > 0) {
      this.logger.log(
        `Found ${reactivatedPermissions.length} permissions that are no longer orphaned:`,
      );

      for (const permission of reactivatedPermissions) {
        await this.db.permission.update({
          where: { id: permission.id },
          data: { isOrphaned: false },
        });

        this.logger.log(
          `  ✓ ${permission.key}: ${permission.name} (reactivated)`,
        );
      }
    }

    this.logger.log(
      `Permission seeding completed: ${processedFeatureKeys.size} features, ${processedPermissionKeys.size} permissions.`,
    );

    if (orphanedPermissions.length > 0 || orphanedFeatures.length > 0) {
      this.logger.warn(
        `Orphaned permissions and features detected. Consider removing them manually if they are no longer needed.`,
      );
    }
  }

  /**
   * Generates a human-readable permission name from a permission key
   * e.g. 'PATIENT_MANAGEMENT_VIEW' -> 'Patient Management View'
   * @param key
   */
  private generatePermissionName(key: string) {
    return key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  async performSanityCheck(): Promise<boolean> {
    this.logger.log('Performing sanity check...');

    const scannedFeatures = this.metadataScanner.scanFeatures();
    const existingFeatures = await this.db.feature.findMany({
      include: { permissions: true },
    });

    let isInSync = true;

    for (const { feature } of scannedFeatures) {
      const featureExists = existingFeatures.find((f) => f.key === feature.key);

      if (!featureExists) {
        this.logger.warn(`Feature ${feature.key} does not exist in database`);
        isInSync = false;
      }
    }

    for (const { feature, permissions } of scannedFeatures) {
      const dbFeature = existingFeatures.find((f) => f.key === feature.key);

      if (!dbFeature) continue;

      for (const permission of permissions) {
        const permissionExists = dbFeature.permissions.find(
          (p) => p.key === permission.key,
        );
        if (!permissionExists) {
          this.logger.warn(
            `Permission ${permission.key} does not exist in database`,
          );
          isInSync = false;
        }
      }
    }

    if (isInSync) {
      this.logger.log('Sanity check passed: Database is in sync');
    } else {
      this.logger.warn('Sanity check failed: Database is out of sync');
    }
    return isInSync;
  }
}
