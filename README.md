# visioncraft-assignement-backend

## Steps to set up the application:
- Clone the repository by using the command git clone 
- Run the command npm install


## Setting up database:

- Create a database schema through the command line or MySQL workbench.

- Change the environment varibles in the .env file located in teh root directory.
    DATABASE_DEV = nameOfYourDevelopmentDatabase
    DATABASE_TEST = nameOFyourTestDatabase
    DATABASE_USERNAME = yourDatabaeUsername
    DATABASE_PASSWORD = yourDatabasePassword
    DATABASE_DIALECT = yourDatabaseDialect
- Run the command npx sequelize-cli db:migrate
    The database will be created with the user table.

## How to run test cases

To run test cases which are located in 2 files UserRegister.spec.js and UserLogin.spec.js in directory __tests__

- run command the following commands:
    - For userRegister - npm test UserRegister.spec.js
    - For UserLogin - npm test UserLogin.spec.js
