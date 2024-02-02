# Yes Or No

1. `bun run index.ts`
2. http://localhost:3000

list all your filesystem usages.
A response example below
```json
[
    {
        "filesystem":"tmpfs",
        "blocks":814028,
        "used":89304,
        "available":724724,
        "free":90,
        "capacity":"11%",
        "mounted":"/run"
    },
    {
        "filesystem":"/dev/sda1",
        "blocks":409659944,
        "used":236901128,
        "available":151875824,
        "free":40,
        "capacity":"61%",
        "mounted":"/"
    }
]
```

free is a number which means disk space left(percent)

## Make response 500 when disk space exhausted

`http://localhost:3000?filesystem=/dev/sda1&minfree=40`

This url would return 500 when `/dev/sda1` disk space remaining < 40%, or return 200.

You can change the url query string for new  threshold or target easyly.

That makes you extremely easy for integration of status monitors, such as [Uptime Kuma](https://uptime.kuma.pet/) or [UptimeRobot](https://uptimerobot.com/). 

## Futher monitors
If you like this idea please let me know, more items would come (e.g. memory usage)

## Lisence
the MIT