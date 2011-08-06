# cron.js

a javascript job scheduler inspired by cron. 

* Homepage: http://stefanliebenberg.github.com/cron.js/  
* Contact: siga.fredo@gmail.com  
* Licensee: http://creativecommons.org/licenses/by/3.0/  

## notice:

_This documentations is incomplete, send me a message on github if you have any questions. Also see the examples folder for some usage examples._


## About

**cron.js** is a cron scheduler for JavaScript. It allows you to run jobs at specific intervals, defined by standard cron syntax. These intervals range from specific months to every second.


## Getting the code:
 

Grab one of the files in that directory:

  https://github.com/StefanLiebenberg/cron.js/tree/master/build
  
These files should be there:

  *  cron.min.js      - recommended for general use.
  *  cron.js          - unminified source code.
  *  cron.compiled.js - experimental


#Make Script:


Creates the cron.js file:

```shell
make
```

Creates the cron.min.js and cron.compiled.js files

```shell
make compile
```

Usage:
---

Usage is inteded to basic. There are three main objects, CronSpec, Cron and Crontab.

* CronSpec - inteprets cronsyntax and understands how the calculate dates from it.
* Cron     - new Cron( schedule, function ) will create a job that can be given to Crontab to manage/run;
* Crontab  - Job Scheduler;

You will only need to know about Cron and Crontab.

###Cron


```javascript
var schedule = "0 0 1,13 * * *"; // 1 am and 1 pm every day
var job = new Cron( schedule, function () {
  // task goes here
});
```

Crontab.add( job );

###Crontab

```javascript
Crontab.add( job );
Crontab.remove( job );
Crontab.start();
Crontab.stop();
```


##Syntax:


The General Syntax looks like this:
```javascript
// Sec Min Hour Day Month Weekday  
// *  *    *    *   *     *        
```

###Seconds:

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
