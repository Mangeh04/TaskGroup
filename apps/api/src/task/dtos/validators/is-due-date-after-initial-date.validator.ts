import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { TASK_DTO_ERROR_CODES } from 'src/utils/constants';

@ValidatorConstraint({ name: 'isDueDateAfterInitialDate', async: false })
export class IsDueDateAfterInitialDate implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments) {
    const obj = args.object as any;

    if (!obj?.initialDate || !obj?.dueDate) return true;

    const initial = new Date(obj.initialDate);
    const due = new Date(obj.dueDate);

    if (isNaN(initial.getTime()) || isNaN(due.getTime())) return true;
    return due.getTime() >= initial.getTime();
  }

  defaultMessage() {
    return TASK_DTO_ERROR_CODES.DUE_DATE_BEFORE_INITIAL_DATE;
  }
}
