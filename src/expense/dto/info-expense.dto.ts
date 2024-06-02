import { PartialType } from '@nestjs/swagger';
import { CreateExpenseDto } from './create-expense.dto';

export class InfoExpenseDto extends PartialType(CreateExpenseDto) {}
