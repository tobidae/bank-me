# Bank Me

Collects your bank transaction details and exports the data to a Google sheet along with the transaction category (Food, Entertainment, e.t.c). 

## Why Bank Me?
1. Good for budgeting by using past spending patterns to budget for the future
2. Up to 24 months of data in the same spreadsheet for easy access
3. Look at categories you spend a lot and work on cutting or spending more
4. It's DATA!!!

## Requirements
1. [Npm](https://www.npmjs.com/get-npm)
1. [Plaid](https://plaid.com)
2. [Google Cloud Project](https://console.cloud.google.com/) for service account
3. [Google Sheet](https://sheets.google.com)

## Configuration
For this project to work in its entirety, you need a plaid account which is free and a service account from Google Cloud to create a headless user that can access your Google Sheet.

1. Create a `.env` file from the `.env-sample` file
2. Add the plaid keys to the `.env` file
3. Get the id from a created Google sheet (It's the longest id in the sheet url) and add it to the `.env` file.
4. Create a google cloud project (It's free), enable the Drive API from API & Services.
5. Create a JSON service account credential at least editor access, save it to config/service_account.json in the project directory
6. Run `npm install`

## How it works
1. To run the project, a simple `node index.js` will run the server and "frontend".
2. You'll need to link your bank account everytime you run the project, you can add a provision to store the access key if you choose.
3. You can look at your accounts, the balance, types and names
4. To export your transactions to Google sheets, simply click on export transactions (duh).

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

## ToDo
- Add filtering of tx types
- Add visual representation of tx
- Beautify the Google sheet (maybe, I mean who cares?!)
- Actual business name for tx names (crap's ugly)

## Donations
- Bitcoin - 16xLHT2K3aQgxBFEAFXyb9ji5HsoZG76d7
- Ether - 0x75ac2D75F68C90Ca5667d73ed214925a68fE3f53
- Litecoin - LXAKso9VAmfB8jvZb5d3k86vY6hHFFV1Qe
- USD - Bruh

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
