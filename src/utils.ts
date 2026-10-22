import { isValid, parse, parseISO } from "date-fns";

export function getTimeZoneName(
	date: Date,
	style: Intl.DateTimeFormatOptions["timeZoneName"] = "short",
): string | undefined {
	return new Intl.DateTimeFormat(undefined, { timeZoneName: style })
		.formatToParts(date)
		.find((part) => part.type === "timeZoneName")?.value;
}

// Abbreviations are ambiguous worldwide (e.g. "CST" is also China Standard Time),
// so only include the ones your users actually send.
const TZ_ABBREVIATIONS: Record<string, string> = {
	UTC: "+00:00",
	GMT: "+00:00",
	EST: "-05:00",
	EDT: "-04:00",
	CST: "-06:00",
	CDT: "-05:00",
	MST: "-07:00",
	MDT: "-06:00",
	PST: "-08:00",
	PDT: "-07:00",
	AKST: "-09:00",
	AKDT: "-08:00",
	HST: "-10:00",
	BST: "+01:00",
	CET: "+01:00",
	CEST: "+02:00",
};

const FORMATS = [
	// With offsets (XXX matches "-04:00" or "Z", XX matches "-0400")
	"MMMM d, yyyy 'at' h:mm:ss a XXX",
	"MMMM d, yyyy 'at' h:mm a XXX",
	"MMMM d, yyyy h:mm:ss a XXX",
	"MMM d, yyyy h:mm a XXX",
	"yyyy-MM-dd HH:mm:ss XXX",
	"yyyy-MM-dd HH:mm:ss XX",
	"MM/dd/yyyy HH:mm XXX",
	"MM/dd/yyyy h:mm a XXX",
	// RFC 2822 / HTTP dates, e.g. "Thu, 22 Oct 2026 15:28:43 GMT"
	"EEE, d MMM yyyy HH:mm:ss XXX",
	"EEE, d MMM yyyy HH:mm:ss XX",

	// Without timezone (interpreted as local time)
	"MMMM d, yyyy 'at' h:mm:ss a",
	"MMMM d, yyyy 'at' h:mm a",
	"yyyy-MM-dd HH:mm:ss",
	"EEE MMM d HH:mm:ss",
	"yyyy-MM-dd HH:mm",
	"MM/dd/yyyy HH:mm",
	"MM/dd/yyyy",
	"dd.MM.yyyy",
	"MMM d, yyyy",
	"d MMM yyyy",
];

// Replace a trailing abbreviation like "EDT" with its offset, e.g. "-04:00"
function normalizeTimeZone(input: string): string {
	return input.trim().replace(/\s([A-Z]{2,5})$/, (match, abbr: string) => {
		const offset = TZ_ABBREVIATIONS[abbr];
		return offset ? ` ${offset}` : match;
	});
}

export function parseAnyDate(input: string): Date | null {
	const iso = parseISO(input);
	if (isValid(iso)) return iso;

	const normalized = normalizeTimeZone(input);
	for (const fmt of FORMATS) {
		const d = parse(normalized, fmt, new Date());
		if (isValid(d)) return d;
	}
	return null;
}

export function bold(text: string): string {
	return `\x1b[1m${text}\x1b[0m`;
}
export function grey(text: string): string {
	return `\x1b[90m${text}\x1b[0m`;
}
