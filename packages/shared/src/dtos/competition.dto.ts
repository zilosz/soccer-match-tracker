import { IsPositive, IsString } from "class-validator";

export class CompetitionDTO {
	@IsPositive()
	id!: number;

	@IsString()
	name!: string;
}
