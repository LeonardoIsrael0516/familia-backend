import { IsObject } from 'class-validator';

export class SavePlannerProgressDto {
  @IsObject({ message: 'checks deve ser um objeto' })
  checks: Record<string, boolean>;
}
