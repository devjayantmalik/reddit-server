import { is_valid_article } from "../../../tools/validators/article";

describe("Article Success Validators", () => {
  it("should pass for valid article", () => {
    const { error, value } = is_valid_article({ title: "Hello", markdown: "Sample Text" });
    expect(value).toBeDefined();
    expect(error).toBeUndefined();
  });
});

describe("Article Failure Validators", () => {
  it("should fail to validate article with empty object.", () => {
    const { error, value } = is_valid_article({});
    expect(value).toBeUndefined();
    expect(error?.isCustomError).toBeTruthy();
  });
});
