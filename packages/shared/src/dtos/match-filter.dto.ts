import { Transform } from "class-transformer";
import { IsDate, IsInt, IsOptional, IsPositive } from "class-validator";

export class MatchFilterDTO {
  @IsPositive()
  @IsInt()
  @IsOptional()
  teamId?: number;

  @IsPositive()
  @IsInt()
  @IsOptional()
  competitionId?: number;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  endDate?: Date;
}
