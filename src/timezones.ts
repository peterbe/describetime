export interface TimezoneInfo {
	label: string;
	city: string;
	ianaZone: string;
}

export const MISC_TIMEZONES: TimezoneInfo[] = [
	{ label: "Eastern", city: "New York", ianaZone: "America/New_York" },
	{ label: "Central", city: "Chicago", ianaZone: "America/Chicago" },
	{ label: "Mountain", city: "Denver", ianaZone: "America/Denver" },
	{ label: "Mountain (no DST)", city: "Phoenix", ianaZone: "America/Phoenix" },
	{ label: "Pacific", city: "Los Angeles", ianaZone: "America/Los_Angeles" },
	{ label: "Alaska", city: "Anchorage", ianaZone: "America/Anchorage" },
	{ label: "Hawaii-Aleutian", city: "Honolulu", ianaZone: "Pacific/Honolulu" },
	// US territories
	// { label: "Atlantic",          city: "San Juan",     ianaZone: "America/Puerto_Rico" },
	// { label: "Samoa",             city: "Pago Pago",    ianaZone: "Pacific/Pago_Pago" },
	// { label: "Chamorro",          city: "Guam",         ianaZone: "Pacific/Guam" },

	// International
	{ label: "UK", city: "London", ianaZone: "Europe/London" },
	{ label: "Central European", city: "Paris", ianaZone: "Europe/Paris" },
];

export function formatInTimezone(date: Date, ianaZone: string): string {
	return new Intl.DateTimeFormat("en-US", {
		timeZone: ianaZone,
		dateStyle: "medium",
		timeStyle: "short",
		// timeZoneName: "short",
	}).format(date);
}

export function getTimesAcrossUS(date: Date = new Date()) {
	return MISC_TIMEZONES.map((tz) => ({
		...tz,
		time: formatInTimezone(date, tz.ianaZone),
	}));
}
