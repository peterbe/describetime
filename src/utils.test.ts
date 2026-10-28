import { describe, expect, test } from "bun:test";

import { getTimeZoneName, parseAnyDate } from "./utils";

describe("utils", () => {
  test.each([
    ["October 11, 2026 at 11:23:00 AM CST"],
    ["2026-10-11 11:23:00 -06:00"],
    ["10/11/2026 11:23 AM CST"],
    ["Thu, 22 Oct 2026 15:28:43 GMT"],
    ["Sun Oct 25 17:05:22 2026 +0300"],
  ])("parse any date %s", (input) => {
    const date = parseAnyDate(input);
    expect(date).toBeDate();
  });
  test("get time zone name", () => {
    const date = new Date();
    const timeZoneName = getTimeZoneName(date);
    expect(timeZoneName).toBe("UTC"); // does this even work outside my machine??
  });
});
