# TelebotFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.2.

A backend server needs to be running as well for this app to work.
You can specify ip and port in file `app/app.config.ts`.

This project is a webpage, that allows modifying and running Telegram bot files from the backend server. Scripts should be written using features from [Telegraf.js](https://www.npmjs.com/package/telegraf) library. Variable `bot` is the instance of the `Telegraf` class that is available to the user. Example of the script that replies with the same text it received: 

`bot.on('message', (ctx) => ctx.reply(ctx.update.message.text));`

Another part of this project is message and user database, that is stored on the server as well. It can be viewed in tabs 'Users' and 'Messages'. 

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
