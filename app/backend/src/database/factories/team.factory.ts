import { setSeederFactory } from "typeorm-extension";
import { TeamEntity } from "../../entities/Team.js";

export default setSeederFactory(TeamEntity, (faker) => {
  const city = faker.location.city();

  return {
    name: `${city} FC`,
    city: city,
    country: faker.location.country(),
  };
});
