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

const validUser = {
  firstName: "testFirstName",
  lastName: "testLastName",
  email: "testEmail@email.com",
  password: "TestUser123@",
};

// postUser method with validUser as default value
const postUser = (user = validUser) => {
  return request(app).post("/api/1.0/users/register").send(user);
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
    expect(savedUser.password).not.toBe("TestUser123@");
  });

  it("returns 400 error when firstName is null", async () => {
    const response = await postUser({
      firstName: null,
      lastName: "testLastName",
      email: "testEmail@email.com",
      password: "TestUser123@",
    });
    expect(response.status).toBe(400);
  });

  it("returns validationErrors filed in esponse body when validation error occur", async () => {
    const response = await postUser({
      firstName: null,
      lastName: "testLastName",
      email: "testEmail@email.com",
      password: "TestUser123@",
    });
    const body = response.body;
    expect(body.validationErrors).not.toBeUndefined();
  });

  it("returns message - firstName cannot be null, when firstName is null", async () => {
    const response = await postUser({
      firstName: null,
      lastName: "testLastName",
      email: "testEmail@email.com",
      password: "TestUser123@",
    });
    const body = response.body;
    expect(body.validationErrors.firstName).toBe("firstName cannot be null");
  });

  it("returns message - lastName cannot be null, when lastName is null", async () => {
    const response = await postUser({
      firstName: "testFirstName",
      lastName: null,
      email: "testEmail@email.com",
      password: "TestUser123@",
    });
    const body = response.body;
    expect(body.validationErrors.lastName).toBe("lastName cannot be null");
  });

  it("returns message - email cannot be null, when email is null", async () => {
    const response = await postUser({
      firstName: "testFirstName",
      lastName: "testLastName",
      email: null,
      password: "TestUser123@",
    });
    const body = response.body;
    expect(body.validationErrors.email).toBe("email cannot be null");
  });

  it("returns message - password cannot be null, when password is null", async () => {
    const response = await postUser({
      firstName: "testFirstName",
      lastName: "testLastName",
      email: "testEmail@email.com",
      password: null,
    });
    const body = response.body;
    expect(body.validationErrors.password).toBe("password cannot be null");
  });

  it("returns errors for both email and password, when email and password are null", async () => {
    const response = await postUser({
      firstName: "testFirstName",
      lastName: "testLastName",
      email: null,
      password: null,
    });
    const body = response.body;
    expect(Object.keys(body.validationErrors)).toEqual(["email", "password"]);
  });

  /** Dynamic Testing using jest, this approach can replace some of the testcases above
    because they have some repeting code
   */

  it.each`
    field          | value              | expectedMessage
    ${"firstName"} | ${null}            | ${"firstName cannot be null"}
    ${"firstName"} | ${"fi"}            | ${"Must have min 3 and max 40 characters"}
    ${"firstName"} | ${"a".repeat(41)}  | ${"Must have min 3 and max 40 characters"}
    ${"lastName"}  | ${null}            | ${"lastName cannot be null"}
    ${"lastName"}  | ${"la"}            | ${"Must have min 3 and max 40 characters"}
    ${"lastName"}  | ${"a".repeat(41)}  | ${"Must have min 3 and max 40 characters"}
    ${"email"}     | ${null}            | ${"email cannot be null"}
    ${"email"}     | ${"mail.com"}      | ${"email not valid"}
    ${"email"}     | ${"user.mail.com"} | ${"email not valid"}
    ${"email"}     | ${"user@mail"}     | ${"email not valid"}
    ${"password"}  | ${null}            | ${"password cannot be null"}
    ${"password"}  | ${null}            | ${"password cannot be null"}
    ${"password"}  | ${"P4ssw"}         | ${"Password must have atleast 8 characters"}
    ${"password"}  | ${"alllowercase"}  | ${"Password must contain an uppercase,a lowercase, and a number"}
    ${"password"}  | ${"ALLUPPERCASE"}  | ${"Password must contain an uppercase,a lowercase, and a number"}
    ${"password"}  | ${"1234567890"}    | ${"Password must contain an uppercase,a lowercase, and a number"}
    ${"password"}  | ${"lowerandUPPER"} | ${"Password must contain an uppercase,a lowercase, and a number"}
    ${"password"}  | ${"lower4nd5667"}  | ${"Password must contain an uppercase,a lowercase, and a number"}
    ${"password"}  | ${"UPPER44444"}    | ${"Password must contain an uppercase,a lowercase, and a number"}
  `(
    "returns $expectedMessage when $field is $value",
    async ({ field, expectedMessage, value }) => {
      const user = {
        firstName: "testFirstName",
        lastName: "testLastName",
        email: "testEmail@email.com",
        password: "TestUser123@",
      };
      user[field] = value;
      const response = await postUser(user);
      const body = response.body;
      expect(body.validationErrors[field]).toBe(expectedMessage);
    },
  );

  it("returns email in use error, when same email is already in use", async () => {
    await User.create({ ...validUser });
    const response = await postUser();
    expect(response.body.validationErrors.email).toBe("email already in use");
  });

  it("returns errors from both lastName is null and email is in use", async () => {
    await User.create({ ...validUser });
    const response = await postUser({
      firstName: "testFirstName",
      lastName: null,
      email: "testEmail@email.com",
      password: "TestUser123@",
    });
    const body = response.body;
    expect(Object.keys(body.validationErrors)).toEqual(["lastName", "email"]);
  });
});
