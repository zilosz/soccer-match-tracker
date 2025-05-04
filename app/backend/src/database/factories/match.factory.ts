import { setSeederFactory } from "typeorm-extension";
import { MatchEntity } from "../../entities/Match.js";

export default setSeederFactory(MatchEntity, (faker) => {
  return {
    date: faker.date.between({
      from: "2000-01-01",
      to: faker.date.recent(),
    }),
    homeGoals: faker.number.int({ min: 0, max: 5 }),
    awayGoals: faker.number.int({ min: 0, max: 5 }),
  };
});
