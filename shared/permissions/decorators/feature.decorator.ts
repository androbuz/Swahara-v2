import { SetMetadata } from '@nestjs/common';

export const FEATURE_METADATA_KEY = 'feature:metadata';

export interface FeatureMetadata {
  key: string;
  name: string;
  description: string;
}

/**
 * Feature decorator: Marks a controller with a feature metadata
 * @param key - Unique feature (e.g. 'PATIENT_MANAGEMENT')
 * @param name - Human readable feature name (e.g. 'Patient Management')
 * @param description - Feature description (e.g. 'Manage patients...')
 */
export function Feature(key: string, name: string, description: string) {
  const metadata: FeatureMetadata = { key, name, description };
  return SetMetadata(FEATURE_METADATA_KEY, metadata);
}
