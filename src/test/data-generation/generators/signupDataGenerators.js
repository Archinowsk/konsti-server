const logger = require('../../../utils/logger').logger;
const db = require('../../../mongodb');
const getRandomInt = require('./randomVariableGenerators').getRandomInt;

const getGames = () => db.getGamesData();
const getUsers = () => db.getUsersData();

const signup = (games, user) => {
  // let randomIndex = getRandomInt(0, users.length - 1);
  // const randomUser = users[randomIndex].username;
  // logger.info(`Signup: selected user: ${randomUser}`);
  const randomGames = [];
  let randomIndex;

  for (let i = 0; i < 3; i += 1) {
    randomIndex = getRandomInt(0, games.length - 1);
    const randomGame = games[randomIndex].id;
    if (randomGames.includes(randomGame)) {
      i -= 1;
    } else {
      randomGames.push(randomGame);
    }
  }

  logger.info(`Signup: selected games: ${randomGames}`);

  const gamesWithPriorities = [];

  randomGames.forEach((randomGame, index) => {
    gamesWithPriorities.push({ id: randomGame, priority: index + 1 });
  });

  return db.storeSignupData({
    username: user.username,
    selectedGames: gamesWithPriorities,
  });

  // TODO: Different users: some sign for all three, some for one
};

const signupMultiple = (count, games, users) => {
  logger.info(`Signup: ${games.length} games`);
  logger.info(`Signup: ${users.length} users`);
  logger.info(`Signup: Generate signup data for ${count} users`);

  return (function loop(i) {
    return new Promise(resolve =>
      signup(games, users[i - 1]).then(() => resolve())
    ).then(() => i >= count || loop(i + 1));
  })(1);
};

const createSignupData = count => {
  // Sign up users to games
  logger.info('Generate signup data');

  let games = [];
  let users = [];

  return getGames()
    .then(response => {
      games = response;
      return getUsers();
    })
    .then(response => {
      users = response;
    })
    .then(() => signupMultiple(count, games, users))
    .catch(error => logger.error(error));
};

module.exports = { createSignupData };
