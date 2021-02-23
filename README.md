# visioncraft-assignement-backend

## Steps to set up the application:
- Clone the repository by using the command "git clone https://github.com/gurparshad/visioncraft-assignement-backend.git"
- Run the command(without quotes) "npm install"


## Setting up database:

- Create a database schema through the command line or MySQL workbench.
 Please setup one database for the development and second for testing

- Change the environment varibles in the .env file located in the root directory.
    - DATABASE_DEV = nameOfYourDevelopmentDatabase
    - DATABASE_TEST = nameOFyourTestDatabase
    - DATABASE_USERNAME = yourDatabaeUsername
    - DATABASE_PASSWORD = yourDatabasePassword
    - DATABASE_DIALECT = yourDatabaseDialect
    
- Run the command "npx sequelize-cli db:migrate"
    The database will be created with the user table.

## How to run test cases

To run test cases which are located in 2 files UserRegister.spec.js and UserLogin.spec.js in directory __tests__

- run the following commands:
    - For userRegister - "npm test UserRegister.spec.js"
    - For UserLogin - "npm test UserLogin.spec.js"

## Postman API Client link
https://www.getpostman.com/collections/a442da7f79438735b9c9


## Languages and libraries used

- node js
- express js
- javascript
- jest
- supertest
- sequelize
- mysql2
- bcrypt
- sequelize-cli
- express-validators
- cross-env
- config
