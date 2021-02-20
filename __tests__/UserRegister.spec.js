const request = require("supertest");
const app = require("../src/app");
const User = require("../src/user/User");
const sequelize = require("../src/config/database");

// create the tables if not exist
beforeAll(() => {
  return sequelize.sync();
});

// cleand the user table before each test
beforeEach(() => {
  return User.destroy({ truncate: true });
});

describe("User Registration", () => {
  it("returns 200 OK when signup request is valid", (done) => {
    request(app)
      .post("/api/1.0/users")
      .send({
        firstName: "user1",
        lastName: "lastname",
        email: "email@email.com",
        password: "password",
      })
      .then((response) => {
        expect(response.status).toBe(200);
        done();
      });
  });

  it("returns success message when signup request is valid", (done) => {
    request(app)
      .post("/api/1.0/users")
      .send({
        firstName: "user1",
        lastName: "lastname",
        email: "email@email.com",
        password: "password",
      })
      .then((response) => {
        expect(response.body.message).toBe("user created");
        done();
      });
  });

  it("saves the user to database", (done) => {
    request(app)
      .post("/api/1.0/users")
      .send({
        firstName: "user1",
        lastName: "lastname",
        email: "email@email.com",
        password: "password",
      })
      .then(() => {
        User.findAll().then((userList) => {
          expect(userList.length).toBe(1);
          done();
        });
      });
  });

  it("saves the firstName and lastName to the database", (done) => {
    request(app)
      .post("/api/1.0/users")
      .send({
        firstName: "testFirstName",
        lastName: "testLastName",
        email: "testEmail@email.com",
        password: "testpassword",
      })
      .then(() => {
        User.findAll().then((userList) => {
          const savedUser = userList[0];
          expect(savedUser.firstName).toBe("testFirstName");
          expect(savedUser.lastName).toBe("testLastName");
          done();
        });
      });
  });

  it("saves the email in the database", (done) => {
    request(app)
      .post("/api/1.0/users")
      .send({
        firstName: "testFirstName",
        lastName: "testLastName",
        email: "testEmail@email.com",
        password: "testpassword",
      })
      .then(() => {
        User.findAll().then((userList) => {
          const savedUser = userList[0];
          expect(savedUser.email).toBe("testEmail@email.com");
          done();
        });
      });
  });

  it("hashes the password in database", (done) => {
    request(app)
      .post("/api/1.0/users")
      .send({
        firstName: "testFirstName",
        lastName: "testLastName",
        email: "testEmail@email.com",
        password: "testpassword",
      })
      .then(() => {
        User.findAll()
          .then((userList) => {
            const savedUser = userList[0];
            expect(savedUser.password).not.toBe("testpassword");
            done();
          })
          .catch((error) => console.log(error));
      });
  });
});
