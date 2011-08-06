About
---

cron.js is a cron schedular for JavaScript. The biggest difference in cron.js is that you can schedule events on a per second interval.

Notice:
---

This documentations is incomplete, send me a message on github if you have any questions. Also see the output the examples folder.

Building
---

Just run the makefile.

```shell
cd /path/to/cron.js;
make;
```

Getting the Build File
---

grap the file from build/cron.js

Usage:
---

Usage is pretty basic. You create a new CronJob with new Cron( schedule, job );

```javascript
var cronjob = new Cron( "@hour", function () {
   // task goes here
});
```
    
Now add the cron to the Crontab:

```javascript
Crontab.add( cronjob );
```
    
Start the Crontab with `Crontab.start()` and stop it with `Crontab.stop()`;


Schedule:
---

```javascript
// Sec Min Hour Day Month Weekday  
// *  *    *    *   *     *
```
