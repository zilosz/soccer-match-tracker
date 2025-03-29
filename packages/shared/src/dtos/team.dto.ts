import { IsPositive, IsString } from "class-validator";

export class TeamDTO {
	@IsPositive()
	id!: number;

	@IsString()
	name!: string;

	@IsString()
	city!: string;

	@IsString()
	country!: string;
}
