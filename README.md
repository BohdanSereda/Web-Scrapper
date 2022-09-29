# Web scraper

## Description

Web Scraper implementation for data scraping from the website which publishes crowd-sourced reviews about businesses.<br />
Third-party services Integration - Telegram, Twitter

## Features

- [x] Database ([typeorm](https://www.npmjs.com/package/typeorm)).
- [x] Mailing ([nodemailer](https://www.npmjs.com/package/nodemailer), [@nestjs-modules/mailer](https://www.npmjs.com/package/@nestjs-modules/mailer)).
- [x] Posting tweets about business events with Twitter API
- [x] Restaurant tables reservation with Telegram bot
- [x] Swagger documentation.

## Quick run

```bash
git clone --depth 1 https://github.com/BohdanSereda/OLX-Clone-Api.git my-app
cd my-app/
cp .env.example .env
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Documentation
- http://localhost:3000/api/docs#/