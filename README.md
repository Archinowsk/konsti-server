# konsti-server

Konsti is a signup tool. Registered users can choose weighted preferences (i.e. option 1, option 2, option 3) and signup slots are quickly allocated using [Hungarian algorithm](https://en.wikipedia.org/wiki/Hungarian_algorithm).

Konsti is designed for the role-playing convention [Ropecon](https://ropecon.fi). It was used in Ropecon 2017 by ~500 users to sign up for [tabletop role-playing games](https://en.wikipedia.org/wiki/Tabletop_role-playing_game). Second version will be out for Ropecon 2018. Configs are done into the code at the moment, but more general configurable version will be available in the future.

Supported features:

* Admins
  * Fetch game data from JSON source
  * Hide selected games
  * Toggle signup open for a time slot
  * Run the allocation algorithm
* Users
  * Registration with a pre-generated serial key
  * Browse game details and toggle favorites
  * Sign up to games by choosing 1-3 options
  * See the signup data once the allocation algorithm is run

Tech:

* Back-end
  * Node.js
  * Express
  * Azure App Service
  * MongoDB / Cosmos DB
* Front-end (see [konsti-client](https://github.com/Archinowsk/konsti-client))
  * React
  * Redux
  * ES6
  * Webpack
