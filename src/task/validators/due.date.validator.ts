import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateTaskDto } from "../dto/create.task.dto";

@ValidatorConstraint({ name: 'DueDate', async: false })
export class DueDateValidator implements ValidatorConstraintInterface {
  validate(date: Date): boolean {
    const currentDate = new Date();
    return date >= currentDate;
  }

  defaultMessage(): string {
    return 'Дата не может быть в прошлом времени!';
  }
}

export function IsDueDate(validationOptions?: ValidationOptions) {
  return function (object: CreateTaskDto, propertyName: keyof CreateTaskDto): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: DueDateValidator,
    });
  };
}
