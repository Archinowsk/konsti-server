const logger = require("../../utils/logger").logger;
const db = require("../../mongodb");
const createUsers = require("./generators/userDataGenerators").createUsers;
const createAdminUser = require("./generators/userDataGenerators")
  .createAdminUser;
const createTestUser = require("./generators/userDataGenerators")
  .createTestUser;
const createGames = require("./generators/gameDataGenerators").createGames;
const createSignupData = require("./generators/signupDataGenerators")
  .createSignupData;
const config = require("../../../config");

if (config.env !== "development") {
  logger.error(
    `Data cretion only allowed in dev environment, current env "${config.env}"`
  );
  process.exit();
}

const connect = () => db.connectToDb();
const removeUsers = () => db.removeUsers();
const removeGames = () => db.removeGames();

const newUsersCount = 10; // How many players exist overall, add +2 for test accounts
const newGamesCount = 15; // How many games are availale for signup - minimum is 3
const newSignupsCount = 10; // How many players will sign up for three games

connect()
  .then(() => removeUsers())
  .then(() => removeGames())
  .then(() => createAdminUser())
  .then(() => createTestUser())
  .then(() => createUsers(newUsersCount))
  .then(() => createGames(newGamesCount))
  .then(() => createSignupData(newSignupsCount))
  .then(() => process.exit())
  .catch(error => logger.error(error));
