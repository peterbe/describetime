#!/usr/bin/env bun

import { confirm, input } from "@inquirer/prompts";
import { Command } from "commander";
import { formatRFC3339, formatRFC7231, intlFormatDistance } from "date-fns/fp";

import { version } from "../package.json";
import { describeDateDifference } from "./date-difference-exact";
import { formatInTimezone, MISC_TIMEZONES } from "./timezones";
import { bold, getTimeZoneName, grey, parseAnyDate } from "./utils";

const program = new Command();

program
  .name("describetime")
  .description("Describe a datetime in different ways")
  .version(version)
  .argument("[values...]", "one or more values")
  .action(async (values: string[]) => {
    let asString: string = "";
    let interactive = false;
    if (!values.length) {
      interactive = true;
    } else {
      asString = values.join(" ");
    }

    let asDate: Date | null = null;

    while (interactive) {
      asString = await interactiveInput("Enter a date time value:");
      asDate = parseAnyDate(asString);
      if (asDate !== null) {
        break;
      } else {
        if (asDate === null) {
          console.error("That's not a valid date");
        }
        const well = await confirm({
          message: "Do you want to try again?",
        });
        if (!well) {
          process.exit(0);
        }
      }
    }
    if (!interactive) {
      asDate = parseAnyDate(asString);
    }
    if (asDate === null) {
      console.error("That's not a valid date");
      process.exit(1);
    }

    // console.log("AS SRING", asString)
    // console.log("AS DATE", asDate)
    const fmtLong = new Intl.DateTimeFormat(undefined, {
      dateStyle: "long",
      timeStyle: "long",
    });
    // const fmtTzLong = new Intl.DateTimeFormat(undefined, {
    // 	timeZoneName: "long",
    // });

    const fmtShort = new Intl.DateTimeFormat(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
    // const fmtTzShort = new Intl.DateTimeFormat(undefined, {
    // 	timeZoneName: "short",
    // });
    console.log(
      grey("IN LONG FORMAT    "),
      bold(fmtLong.format(asDate)),
      "in",
      bold(getTimeZoneName(asDate, "long") || ""),
    );
    console.log(
      grey("IN SHORT FORMAT   "),
      bold(fmtShort.format(asDate)),
      "in",
      bold(getTimeZoneName(asDate, "short") || ""),
    );

    console.log(
      grey("DISTANCE          "),
      bold(intlFormatDistance(new Date(), asDate)),
      "  ",
      grey(describeDateDifference(asDate).text),
    );
    console.log(grey("IN ISO FORMAT     "), bold(asDate.toISOString()));
    console.log(grey("IN RFC3339 FORMAT "), bold(formatRFC3339(asDate)));
    console.log(grey("IN RFC7231 FORMAT "), bold(formatRFC7231(asDate)));
    console.log(grey("\nIn different time zones"));
    for (const tz of MISC_TIMEZONES) {
      console.log(grey(`${tz.label}`.padEnd(18)), bold(formatInTimezone(asDate, tz.ianaZone)));
    }
  });

program.parse();

async function interactiveInput(message: string): Promise<string> {
  return await input({
    message,
    required: true,
  });
}
