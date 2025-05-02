import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("teams")
export class TeamEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  name!: string;

  @Column("varchar")
  city!: string;

  @Column("varchar")
  country!: string;
}
