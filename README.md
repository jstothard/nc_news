# NC-News-api

Welcome to the North Coders News api!

This api provides access to the NC-News psql database through the knex library and node.js express module. Testing is via the mocha suite with chai blocks and supertest for testing server functionality.

## Getting Started

### Prerequisites

To check if you have Node.js, npm, git and postgress installed, run these command in your terminal:

```
node -v
npm -v
git --version
postgres -V
```

If it any are not installed then follow the instuction on the respective links below to install:

- https://nodejs.org/en/
- https://github.com/npm/cli
- https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
- https://www.postgresql.org/

### Installing

Clone the repository to your local machine

```
git clone https://github.com/jstothard/nc_news
```

Open the project folder and install the required dependencies

```
npm install
```

You will also need to create a **knexfile** in the root of the project directory, to create this:

```
touch knexfile.js
```

Then copy the following code over to the file updating with your credentials where required

```js
const ENV = process.env.NODE_ENV || "development";

const { DATABASE_URL } = process.env;

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfigs = {
  development: {
    connection: {
      database: "nc_news"
      // username: "",
      // password: "",
    }
  },
  test: {
    connection: {
      database: "nc_news_test"
      // username: "",
      // password: "",
    }
  },
  production: { connection: `${DATABASE_URL}?ssl=true` }
};

module.exports = { ...baseConfig, ...customConfigs[ENV] };
```

Initialise the database:

```
npm run setup-dbs
```

Seed the database with development data:

```
npm run seed
```

The database can now be run

```
npm run dev
```

The development database is now accessible locally from port 9090. Visit http://localhost:9090/api to confirm it is running, it will output a JSON of the endpoints available like below:

```json
{
  "endpoints": {
    "topics": {
      "address": "/api/topics",
      "methods": [
        "GET"
      ]
    },
    "aticles": {
      "address": "/api/articles",
      "methods": [
        "GET"
      ]
    },
    ...
```

## Running the tests

To run the automated tests:

```
npm test
```

To test the utility file tests:

```
npm run utils-test
```

<!-- ### Test breakdown

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```
-->

## Deployment

This database is hosted on Heroku at this address:  
https://nc-news-jstothard.herokuapp.com/api/

## Built With

- [Express](https://expressjs.com/) - The web framework used
- [npm](https://www.npmjs.com/) - Dependency Management
- [knex](https://knexjs.org/) - Used to interface between SQL and Javascript
- [PostgreSQL](https://www.postgresql.org/) - The database system used
- [Node Postgress](https://node-postgres.com/) - Used to interface between SQL and Javascript
- [Mocha](https://mochajs.org/) - Test suite used
- [Chai](https://www.chaijs.com/) - Assertion library for testing
- [nodemon](https://nodemon.io/) - Used to monitor development server
- [supertest](https://github.com/visionmedia/supertest) - Used to test server

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

- **Billie Thompson** - _Initial work_ - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc

# nc_news

## Available Scripts

Create development and test databases locally:

```bash
npm run setup-dbs
```

Create a new migration file:

```bash
npm run migrate-make <filename>
```

Run all migrations:

```bash
npm run migrate-latest
```

Rollback all migrations:

```bash
npm run migrate-rollback
```

Run tests:

```bash
npm test
```

Rollback, migrate -> latest, then start inserting data into the database:

```bash
npm run seed
```

Run the server with `nodemon`, for hot reload:

```bash
npm run dev
```

Run the server with `node`:

```bash
npm start
```
