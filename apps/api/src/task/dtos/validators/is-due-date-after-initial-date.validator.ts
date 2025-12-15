import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isDueDateAfterInitialDate', async: false })
export class IsDueDateAfterInitialDate implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments) {
    const obj = args.object as any;

    if (!obj.initialDate || !obj.dueDate) {
      return true;
    }

    const initial = new Date(obj.initialDate);
    const due = new Date(obj.dueDate);

    if (isNaN(initial.getTime()) || isNaN(due.getTime())) {
      return false;
    }

    return due >= initial;
  }

  defaultMessage() {
    return 'dueDate must be greater than or equal to initialDate';
  }
}
