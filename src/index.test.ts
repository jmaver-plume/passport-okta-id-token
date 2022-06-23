import { run } from "./index";
import { expect } from "chai";

describe("run", function () {
  it("should return 'Hello World!'", function () {
    const actual = run();
    const expected = "Hello World!";
    expect(actual).to.eq(expected);
  });
});
