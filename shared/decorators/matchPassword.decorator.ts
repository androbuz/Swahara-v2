import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { MatchPasswordDto } from '../dtos/password.dto';

@ValidatorConstraint({ name: 'MatchPassword', async: false })
export class MatchPassword implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const object = args.object as MatchPasswordDto;
    return object.password === confirmPassword;
  }

  defaultMessage() {
    return 'Passwords do not match';
  }
}
