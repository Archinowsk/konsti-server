function getRandomString(length) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate() {
  // const dates = ['2017-07-28', '2017-07-29', '2017-07-30'];
  const dates = ['2017-07-28'];
  const randomIndex = Math.floor(Math.random() * dates.length);
  return dates[randomIndex];
}

function getRandomTime() {
  const times = [
    // '10:00',
    // '11:00',
    // '12:00',
    // '13:00',
    // '14:00',
    // '15:00',
    '16:00',
    '17:00',
    // '18:00',
    // '19:00',
    // '20:00',
  ];
  const randomIndex = Math.floor(Math.random() * times.length);
  return times[randomIndex];
}

module.exports = {
  getRandomString,
  getRandomInt,
  getRandomDate,
  getRandomTime,
};
