import { IsInt, IsPositive, IsString } from "class-validator";

export class CompetitionDTO {
	@IsPositive()
  @IsInt()
	id!: number;

	@IsString()
	name!: string;
}
