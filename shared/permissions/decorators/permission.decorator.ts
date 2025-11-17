import { SetMetadata } from '@nestjs/common';

export const PERMISSION_METADATA_KEY = 'permission:metadata';

export interface PermissionMetadata {
  key: string;
  description: string;
}

/**
 * Permission decorator: Marks a route with a permission metadata
 * @param key - Unique permission (e.g. 'PATIENT_MANAGEMENT_VIEW')
 * @param description - Permission description (e.g. 'View patient management')
 */
export function Permission(key: string, description: string) {
  const metadata: PermissionMetadata = { key, description };
  return SetMetadata(PERMISSION_METADATA_KEY, metadata);
}
