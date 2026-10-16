import { describe, expect, test } from "bun:test";
import { getTimeZoneName, parseAnyDate } from "./utils";

describe("utils", () => {
	test("parse any date", () => {
		const date = parseAnyDate("October 11, 2026 at 11:23:00 AM CST");
		expect(date).toBeDate();
	});
	test("get time zone name", () => {
		const date = new Date();
		const timeZoneName = getTimeZoneName(date);
		expect(timeZoneName).toBe("UTC"); // does this even work outside my machine??
	});
});
