import { ErrorResponse } from '../utils';
import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * Asynchronously hashes a plaintext password using bcrypt with the configured salt rounds.
 *
 * @param rawPassword - The plaintext password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export const hashPasswordAsync = async (
  rawPassword: string,
): Promise<string> => {
  const saltRounds = Number(process.env.PASSWORD_SALT_ROUNDS) || 10;

  if (saltRounds < 8) {
    throw new ErrorResponse(
      'Salt rounds must be at least 8 for secure password hashing',
      HttpStatus.BAD_REQUEST,
    );
  }

  return await bcrypt.hash(rawPassword, saltRounds);
};

/**
 * Compares a submitted plaintext password with the hashed password stored in the database.
 *
 * @param submittedPassword - The plaintext password provided by the user.
 * @param dbPassword - The hashed password stored in the database.
 * @returns A boolean indicating whether the passwords match.
 */
export const checkPassword = async (
  submittedPassword: string,
  dbPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(submittedPassword, dbPassword);
};
