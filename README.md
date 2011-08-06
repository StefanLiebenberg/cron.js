# cron.js

_a javascript job scheduler inspired by cron._

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


## Make script:

Create the cron.js file:

```shell
make
```

Create the cron.min.js file:

```shell
make minify
```

Create the cron.compiled.js files

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


## Syntax:


The general syntax looks like this:

```javascript
// Sec Min Hour Day Month Weekday  
// *  *    *    *   *     *        
```

There are six columns to a cron schedule: **seconds, minutes, hours, days, months, weekdays**.
You specify specific values for each of these columns so that scheduler can calculate when to run a given job. 

For each column, the values could be specific numbers, ranges, intervals or all of these combined in a list. 


### Specific Numbers:

Each field has different numbers that are allowed, for example **seconds** and **minutes** will accept any number between 0 and 59. 
Whereas **hours** will only accept numbers between 0-23;

* **seconds**  : 0 to 59
* **minutes**  : 0 to 59
* **hours**    : 0 to 23
* **days**     : 1 to 31
* **months**   : 1 to 12 ( jan, feb, mar and so forth are also supported )
* **weekdays** : 1 to 7  ( mon, tue, wed, thu and so forth are also supported )

### Ranges
  Ranges are two numbers seperated with a "-", and they indicate all numbers from one to the other. 
  eg. `10-30` would indicated all numbers between and including 10 to 30.
  
### Interval
  A interval is a range and a number seperated by "/". The range specifies the group of values, and number speciefies every nth value to take from that range.  
  _eg. `0-10/2` would indicate every 2nd number from 0 to 10, therefore 0,2,4,6,8,10_

### Lists
  Lists are either ranges, numbers, or intervals seperated by commas. eg. `10-30,23,30-40/2`;


You should combind these six columns to specify a interval at which a job object is to be run:

```javascript
var schedule = "0 0 0 * * 2-6"; // 00:00:00 on every weeday
new Cron( schedule, function () {
  // do stuff here
});
```
