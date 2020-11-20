import { is_valid_email, is_valid_user, is_valid_password } from "../../../tools/validators/user";

describe("User Success Validators", () => {
  it("should pass for valid email", () => {
    expect(is_valid_email("test@test.com")).toBeTruthy();
    expect(is_valid_email("222@222.com")).toBeTruthy();
  });
  it("should pass for valid user.", () => {
    const { error, value } = is_valid_user({
      fname: "First",
      lname: "Last",
      email: "test@test.com",
      password: "password@123"
    });
    expect(error).toBeUndefined();
    expect(value).toBeDefined();
  });

  it("should pass for valid password criteria", () => {
    expect(is_valid_password("Password@123")).toBeTruthy();
  });
});

describe("User Failure Validators", () => {
  it("should fail for invalid email", () => {
    expect(is_valid_email("")).toBeFalsy();
    expect(is_valid_email("test232")).toBeFalsy();
  });
  it("should fail to validate user for empty object.", () => {
    const { error, value } = is_valid_user({});
    expect(value).toBeUndefined();
    expect(error).toBeDefined();
  });

  it("should fail to validate short passwords", () => {
    expect(is_valid_password("hello")).toBeFalsy();
  });
});
