export interface DateDifference {
	years: number;
	months: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	/** True if `date` is after `reference` */
	isFuture: boolean;
	/** Human-readable description, e.g. "2 years, 3 months and 4 days ago" */
	text: string;
}

export interface DescribeOptions {
	/** Maximum number of non-zero units to include in `text` (default: all) */
	maxUnits?: number;
}

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

function daysInMonthUTC(year: number, month: number): number {
	// Day 0 of the next month is the last day of this month
	return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

/** Adds whole months, clamping the day so Jan 31 + 1 month = Feb 28/29. */
function addMonthsUTC(date: Date, months: number): Date {
	const total = date.getUTCMonth() + months;
	const year = date.getUTCFullYear() + Math.floor(total / 12);
	const month = ((total % 12) + 12) % 12;
	const day = Math.min(date.getUTCDate(), daysInMonthUTC(year, month));
	return new Date(
		Date.UTC(
			year,
			month,
			day,
			date.getUTCHours(),
			date.getUTCMinutes(),
			date.getUTCSeconds(),
			date.getUTCMilliseconds(),
		),
	);
}

/**
 * Describes `date` relative to `reference` (defaults to now) in years, months, days, hours, minutes
 * and seconds.
 *
 * Years and months are calendar-aware (they respect varying month lengths and leap years).
 * Calculations use UTC, so daylight-saving shifts don't distort the hour/minute/second values.
 */
export function describeDateDifference(
	date: Date,
	reference: Date = new Date(),
	options: DescribeOptions = {},
): DateDifference {
	if (Number.isNaN(date.getTime()) || Number.isNaN(reference.getTime())) {
		throw new RangeError("Invalid date supplied");
	}

	const isFuture = date.getTime() > reference.getTime();
	const start = isFuture ? reference : date;
	const end = isFuture ? date : reference;

	// Find the largest number of whole months that fits between start and end
	let totalMonths =
		(end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
		(end.getUTCMonth() - start.getUTCMonth());
	let anchor = addMonthsUTC(start, totalMonths);
	while (totalMonths > 0 && anchor.getTime() > end.getTime()) {
		totalMonths--;
		anchor = addMonthsUTC(start, totalMonths);
	}

	// Everything left over is a fixed-length span of < 1 month
	let remainder = end.getTime() - anchor.getTime();
	const days = Math.floor(remainder / MS_PER_DAY);
	remainder -= days * MS_PER_DAY;
	const hours = Math.floor(remainder / MS_PER_HOUR);
	remainder -= hours * MS_PER_HOUR;
	const minutes = Math.floor(remainder / MS_PER_MINUTE);
	remainder -= minutes * MS_PER_MINUTE;
	const seconds = Math.floor(remainder / MS_PER_SECOND);

	const years = Math.floor(totalMonths / 12);
	const months = totalMonths % 12;

	const units: [number, string][] = [
		[years, "year"],
		[months, "month"],
		[days, "day"],
		[hours, "hour"],
		[minutes, "minute"],
		[seconds, "second"],
	];

	const parts = units
		.filter(([value]) => value > 0)
		.slice(0, options.maxUnits ?? units.length)
		.map(([value, label]) => `${value} ${label}${value === 1 ? "" : "s"}`);

	let text: string;
	if (parts.length === 0) {
		text = "now";
	} else {
		const joined =
			parts.length === 1
				? parts[0]
				: `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
		text = isFuture ? `in ${joined}` : `${joined} ago`;
	}

	return { years, months, days, hours, minutes, seconds, isFuture, text };
}
