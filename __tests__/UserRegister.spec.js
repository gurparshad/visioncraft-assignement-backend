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

// postUser method with validUser as default value
const postUser = (user = validUser) => {
  return request(app).post("/api/1.0/users").send(user);
};

const validUser = {
  firstName: "testFirstName",
  lastName: "testLastName",
  email: "testEmail@email.com",
  password: "testpassword",
};

describe("User Registration", () => {
  it("returns 200 OK when signup request is valid", async () => {
    const response = await postUser();
    expect(response.status).toBe(200);
  });

  it("returns success message when signup request is valid", async () => {
    const response = await postUser();
    expect(response.body.message).toBe("user created");
  });

  it("saves the user to database", async () => {
    await postUser();
    const userList = await User.findAll();
    expect(userList.length).toBe(1);
  });

  it("saves the firstName and lastName to the database", async () => {
    await postUser();
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.firstName).toBe("testFirstName");
    expect(savedUser.lastName).toBe("testLastName");
  });

  it("saves the email in the database", async () => {
    await postUser();
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.email).toBe("testEmail@email.com");
  });

  it("hashes the password in database", async () => {
    await postUser();
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.password).not.toBe("testpassword");
  });

  it("returns 400 error when firstName is null", async () => {
    const response = await postUser({
      firstName: null,
      lastName: "testLastName",
      email: "testEmail@email.com",
      password: "testpassword",
    });
    expect(response.status).toBe(400);
  });

  it("returns validationErrors filed in esponse body when validation error occur", async () => {
    const response = await postUser({
      firstName: null,
      lastName: "testLastName",
      email: "testEmail@email.com",
      password: "testpassword",
    });
    const body = response.body;
    expect(body.validationErrors).not.toBeUndefined();
  });

  it("returns message - firstName cannot be null, when firstName is null", async () => {
    const response = await postUser({
      firstName: null,
      lastName: "testLastName",
      email: "testEmail@email.com",
      password: "testpassword",
    });
    const body = response.body;
    expect(body.validationErrors.firstName).toBe("firstName cannot be null");
  });
});
