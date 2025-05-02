import { Type } from "class-transformer";
import { IsArray, IsInt, IsNumber, Min, ValidateNested } from "class-validator";
import { MatchDTO } from "./match.dto";

export class ReportStatsDTO {
  @IsArray()
  @Type(() => MatchDTO)
  @ValidateNested({ each: true })
  matches!: MatchDTO[];

  @IsNumber()
  @Min(0)
  avgGoalsPerMatch!: number;

  @IsInt()
  @Min(0)
  numUniqueTeams!: number;

  @IsInt()
  @Min(0)
  numUniqueCompetitions!: number;
}
