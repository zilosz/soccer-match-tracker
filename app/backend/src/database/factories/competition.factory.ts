import { setSeederFactory } from "typeorm-extension";
import { CompetitionEntity } from "../../entities/Competition.js";

export default setSeederFactory(CompetitionEntity, (faker) => {
  const city = faker.location.city();
  const country = faker.location.country();
  const prefix = faker.helpers.arrayElement([city, country]);
  const suffix = faker.helpers.arrayElement(["Cup", "League"]);

  return {
    name: `${prefix} ${suffix}`,
  };
});
