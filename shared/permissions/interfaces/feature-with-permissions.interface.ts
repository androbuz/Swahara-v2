import { FeatureMetadata } from '../decorators/feature.decorator';
import { PermissionMetadata } from '../decorators/permission.decorator';

export interface IFeatureWithPermissions {
  feature: FeatureMetadata;
  permissions: PermissionMetadata[];
  viewPermission?: PermissionMetadata;
}
