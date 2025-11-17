// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { Injectable, Logger } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { IFeatureWithPermissions } from '../../interfaces/feature-with-permissions.interface';
import {
  FEATURE_METADATA_KEY,
  FeatureMetadata,
} from '../../decorators/feature.decorator';
import {
  PERMISSION_METADATA_KEY,
  PermissionMetadata,
} from '../../decorators/permission.decorator';

@Injectable()
export class MetadataScannerService {
  private readonly logger = new Logger(MetadataScannerService.name);

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {}

  scanFeatures(): IFeatureWithPermissions[] {
    const controllers: InstanceWrapper<any>[] =
      this.discoveryService.getControllers();
    const featuresMap = new Map<string, IFeatureWithPermissions>();

    for (const controller of controllers) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { instance } = controller;

      if (!instance) continue;

      const featureMetadata = this.reflector.get<FeatureMetadata>(
        FEATURE_METADATA_KEY,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        instance.constructor,
      );

      if (!featureMetadata) continue;

      const controllerViewPermission = this.reflector.get<PermissionMetadata>(
        PERMISSION_METADATA_KEY,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        instance.constructor,
      );

      if (!featuresMap.has(featureMetadata.key)) {
        featuresMap.set(featureMetadata.key, {
          feature: featureMetadata,
          permissions: [],
          viewPermission: controllerViewPermission,
        });
      }

      if (!featuresMap.has(featureMetadata?.key)) {
        featuresMap.set(featureMetadata?.key, {
          feature: featureMetadata,
          permissions: [],
        });
      }

      const methodNames = this.metadataScanner.getAllMethodNames(
        Object.getPrototypeOf(instance) as unknown,
      );

      for (const methodName of methodNames) {
        const method = instance[methodName] as unknown;
        const permissionMetadata = this.reflector.get<PermissionMetadata>(
          PERMISSION_METADATA_KEY,
          method,
        );

        if (permissionMetadata) {
          const featureData = featuresMap.get(featureMetadata.key);

          const isDuplicate: unknown = featureData?.permissions.some(
            (p) => p.key === permissionMetadata.key,
          );

          if (isDuplicate) {
            this.logger.warn(
              `Duplicate permission key: "${permissionMetadata.key}" found in feature "${featureMetadata.key}" and method "${methodName}"`,
            );
          } else {
            featureData?.permissions.push(permissionMetadata);
          }
        }
      }
    }

    const features = Array.from(featuresMap.values());

    this.logger.log(`Scanned ${features.length} features`);

    return features;
  }
}
