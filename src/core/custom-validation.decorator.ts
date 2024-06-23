import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsOptionalString(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isOptionalString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          console.log(value, value === '', '????');
          // Allow undefined, null, and empty string
          return value != null && value !== '';
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an optional string (including empty string)`;
        },
      },
    });
  };
}
