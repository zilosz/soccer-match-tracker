import { Transform, Type } from "class-transformer";
import {
	IsDate,
	IsInt,
	IsPositive,
	Min,
	ValidateNested,
} from "class-validator";
import { CompetitionDTO } from "./competition.dto";
import { TeamDTO } from "./team.dto";

export class MatchDTONoId {
	@Transform(({ value }) => new Date(value))
	@IsDate()
	date!: Date;

	@Type(() => CompetitionDTO)
	@ValidateNested()
	competition!: CompetitionDTO;

	@Type(() => TeamDTO)
	@ValidateNested()
	homeTeam!: TeamDTO;

	@Type(() => TeamDTO)
	@ValidateNested()
	awayTeam!: TeamDTO;

	@IsInt()
	@Min(0)
	homeGoals!: number;

	@IsInt()
	@Min(0)
	awayGoals!: number;
}

export class MatchDTO extends MatchDTONoId {
	@IsPositive()
	id!: number;
}
