# csv_manager

## Clone repository

To clone the repository use the following commands:

```sh
git clone https://github.com/r37r0m0d3l/csv_manager
cd csv_manager
npm install
```

## Up and running

```sh
docker compose up
npm run build // build backend
npm run build:front // build frontend 
npm run app:cli:generate // generate csv file in `temp` folder
npm start // start server
```

## NPM Scripts

-   `app:cli:generate` - cli to generate fake accounts at `temp` folder
-   `app:cli:import` - cli to import accounts from CSV file
-   `build` - transpile TypeScript
-   `build:clean` - remove coverage data
-   `build:front` - build frontend
-   `build:watch` - interactive watch mode to automatically transpile source files
-   `dev:lint` - lint source files
-   `start` - starts server at port 3001

## Open in browser

Main page - [http://localhost:3001/](http://localhost:3001/)

REST API `/accounts/` - [http://localhost:3001/accounts/](http://localhost:3001/accounts/)
