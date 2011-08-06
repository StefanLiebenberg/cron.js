#Cron.js
##JavaScript Job Scheduler




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

grab the file from build/cron.js

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

you can generate your own cronspec object with

```javascript
CronSpec.parse( schedule )
```

but you should just use a schedule to specify the time interval of a cron job, like so:

```javascript
var schedule = "0 0 0 * * 2-6"; // 00:00:00 on every weeday
new Cron( schedule, function () {
  // do stuff here
});
```
