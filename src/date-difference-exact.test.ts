import { describe, expect, test } from "bun:test";

import { describeDateDifference } from "./date-difference-exact";

describe("describe-difference-exact", () => {
  test("equal dates", () => {
    const date = new Date("2026-10-17 13:33:09.929267+00");
    const reference = new Date("2026-10-17 13:33:09.929267+00");
    const diff = describeDateDifference(date, reference);
    expect(diff).toBeDefined();
    expect(diff.isFuture).toBe(false);
    expect(diff.text).toBe("now");
  });
  test("future dates singular", () => {
    const date = new Date("2026-10-17 13:33:09.929267+00");
    const reference = new Date("2026-10-16 12:32:08.929267+00");
    const diff = describeDateDifference(date, reference);
    expect(diff).toBeDefined();
    expect(diff.isFuture).toBe(true);
    expect(diff.text).toBe("in 1 day, 1 hour, 1 minute and 1 second");
  });
  test("future dates plural", () => {
    const date = new Date("2026-10-17 13:33:09.929267+00");
    const reference = new Date("2026-10-15 11:31:07.929267+00");
    const diff = describeDateDifference(date, reference);
    expect(diff).toBeDefined();
    expect(diff.isFuture).toBe(true);
    expect(diff.text).toBe("in 2 days, 2 hours, 2 minutes and 2 seconds");
  });
  test("past dates singular", () => {
    const date = new Date("2026-10-16 12:32:08.929267+00");
    const reference = new Date("2026-10-17 13:33:09.929267+00");
    const diff = describeDateDifference(date, reference);
    expect(diff).toBeDefined();
    expect(diff.isFuture).toBe(false);
    expect(diff.text).toBe("1 day, 1 hour, 1 minute and 1 second ago");
  });
  test("past dates plural", () => {
    const date = new Date("2026-10-15 11:31:07.929267+00");
    const reference = new Date("2026-10-17 13:33:09.929267+00");
    const diff = describeDateDifference(date, reference);
    expect(diff).toBeDefined();
    expect(diff.isFuture).toBe(false);
    expect(diff.text).toBe("2 days, 2 hours, 2 minutes and 2 seconds ago");
  });
});
