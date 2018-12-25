# [Bank Me](http://bank-me.tobiak.com)

Collects your bank transaction details and exports the data to a Google sheet along with the transaction category (Food, Entertainment, e.t.c). 

## Why Bank Me?
1. Good for budgeting by using past spending patterns to budget for the future
2. Up to 24 months of data in the same spreadsheet for easy access
3. Look at categories you spend a lot and work on cutting or spending more
4. It's DATA!!!

## Requirements
1. [Plaid](https://plaid.com)
2. [Google Cloud Project](https://console.cloud.google.com/) for service account
3. [Google Sheet](https://sheets.google.com)
4. [Firebase](https://firebase.com)
5. Service host like Heroku, Digital Cloud, e.t.c

## Configuration
For this project to work in its entirety, you need a plaid account which is free and a service account from Google Cloud to create a headless user that can access your Google Sheet.

1. Create a `.env` file from the `.env-sample` file (or add the env to Config Var sections of host services)
2. Add the plaid keys to the `.env` file
3. You can choose to use an online datastore, I used Firebase in this project for data persistence or save data locally (see StorageService under services).
4. Create a google cloud project (It's free), enable the Drive API from API & Services.
5. Create a JSON service account credential at least editor access, save it to config/service_account.json in the project directory for dev or on host for production
6. 

## Get it up and running
1. Run `npm install` in both server and root directories
2. To run the project, a simple `npm run run` will run the server and "frontend".
3. The first time you link a bank account, the access key will be stored locally (see BankingService).

## Export Transactions - How it works
A new sheet is created for each month, if the sheet for the month already exists, the transactions are just appended on the newest row. You can run the export transactions multiple times and it would not override existing tx on the sheet (good for if you add custom stuff).

There's a general sheet that has all the months dumped in it, in the future there'll probable be options to export to different file types like CSV.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Features
- Export bank statement to google sheet by month
- View account balance from UI
- View and Filter transactions by date range
- Filter transactions by type

## ToDo
- Add visual representation of tx
- Beautify the Google sheet (maybe, I mean who cares?!)
- Actual business name for tx names (crap's ugly)

## Donations
- Bitcoin - 16xLHT2K3aQgxBFEAFXyb9ji5HsoZG76d7
- Ether - 0x75ac2D75F68C90Ca5667d73ed214925a68fE3f53
- Litecoin - LXAKso9VAmfB8jvZb5d3k86vY6hHFFV1Qe

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
