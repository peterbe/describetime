# describetime

Example use:

```text
➜ describetime December 31, 1969 at 7:00:00 PM EST
IN LONG FORMAT     December 31, 1969 at 7:00:00 PM EST in Eastern Standard Time
IN SHORT FORMAT    12/31/69, 7:00 PM in EST
DISTANCE           57 years ago
IN ISO FORMAT      1970-01-01T00:00:00.000Z
IN RFC3339 FORMAT  1969-12-31T19:00:00-05:00
IN RFC7231 FORMAT  Thu, 01 Jan 1970 00:00:00 GMT
```

or, interactive:

```text
➜ describetime
✔ Enter a date time value: asdasd
That's not a valid date
✔ Do you want to try again? Yes
✔ Enter a date time value: December 31, 1969 at 7:00:00 PM EST
IN LONG FORMAT     December 31, 1969 at 7:00:00 PM EST in Eastern Standard Time
IN SHORT FORMAT    12/31/69, 7:00 PM in EST
DISTANCE           57 years ago
IN ISO FORMAT      1970-01-01T00:00:00.000Z
IN RFC3339 FORMAT  1969-12-31T19:00:00-05:00
IN RFC7231 FORMAT  Thu, 01 Jan 1970 00:00:00 GMT
```


## Dev

```sh
just install
just dev
```

and then run, in another terminal:

```sh
./out/describetime October 11, 2026 at 11:23:00 AM EDT
```
