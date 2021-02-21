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

const postUser = (user = validUser) => {
  return request(app).post("/api/1.0/users/register").send(user);
};

const userLogin = (user = validLoginCredentials) => {
  return request(app).post("/api/1.0/users/login").send(user);
};

const validUser = {
  firstName: "testFirstName",
  lastName: "testLastName",
  email: "testEmail@email.com",
  password: "TestUser123@",
};

const validLoginCredentials = {
  email: "testEmail@email.com",
  password: "TestUser123@",
};

describe("User Login", () => {
  it("returns 200 OK when login request is valid", async () => {
    await postUser();
    const response = await userLogin();
    expect(response.status).toBe(200);
  });

  it("returns 400 error when login request is invalid", async () => {
    await postUser();
    const response = await userLogin({
      email: "notRegistered@email.com",
      password: "TestUser123@",
    });
    expect(response.status).toBe(400);
  });

  it("returns message - email cannot be null, when email is null", async () => {
    await postUser();
    const response = await userLogin({
      email: null,
      password: "TestUser123@",
    });
    const body = response.body;
    expect(body.validationErrors.email).toBe("email cannot be null");
  });

  it("returns message - password cannot be null, when password is null", async () => {
    await postUser();
    const response = await userLogin({
      email: "testEmail@email.com",
      password: null,
    });
    const body = response.body;
    expect(body.validationErrors.password).toBe("password cannot be null");
  });

  it("returns errors for both email and password, when email and password are null", async () => {
    await postUser();
    const response = await userLogin({
      email: null,
      password: null,
    });
    const body = response.body;
    expect(Object.keys(body.validationErrors)).toEqual(["email", "password"]);
  });
});
