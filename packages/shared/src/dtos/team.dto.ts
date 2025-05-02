import { IsInt, IsPositive, IsString } from "class-validator";

export class TeamDTO {
  @IsPositive()
  @IsInt()
  id!: number;

  @IsString()
  name!: string;

  @IsString()
  city!: string;

  @IsString()
  country!: string;
}
