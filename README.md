# cron.js

_a javascript job scheduler inspired by cron._

* Homepage: http://stefanliebenberg.github.com/cron.js/  
* Contact: siga.fredo@gmail.com  
* License: http://creativecommons.org/licenses/by/3.0/  

## notice:

_This documentations is incomplete, send me a message on github if you have any questions. Also see the examples folder for some usage examples._


## About

**cron.js** is a cron scheduler for JavaScript. It allows you to run jobs at set intervals, defined by standard cron syntax.


## Getting the code:
 

Grab one of the files in this directory:

  https://github.com/StefanLiebenberg/cron.js/tree/master/build
  
These files should be there:

  *  cron.compiled.js - compiled with closure. Recommended.
  *  cron.min.js      - minified source code + required closure functions.
  *  cron.src.js      - unminified source code + required closure functions.
  

## Makefile script:

This project uses a makefile to build the required scripts. The following tasks are usefull:

Create the cron.compiled.js file:

```shell
make buid/cron.compiled.js
``` 

Create the cron.min.js file:

```shell
make build/cron.min.js
``` 

Create the cron.src.js file:

```shell
make build/cron.src.js
``` 


Usage:
---

Usage is inteded to basic. There are three main objects: Cron, Cron.Job, Cron.Spec;

* Cron      - Job Scheduler. Manages cron jobs.
* Cron.Job  - Cron Job. Contains a schedule and block information for each job.
* Cron.Spec - Cron Specification. Inteprets cron-syntax and contains the logic for calculating date intervals, etc.

###Cron

```javascript
var cron = new Cron();
cron.start();
cron.add( cronjob );
``` 

###Cron.Spec

```javascript
var spec = new Cron.Spec( '0 0 * * * mon-wed' ) // every minute hour from monday to wednesday;
``` 

###Cron.Job

```javascript
var cronjob = new Cron.Job(new Cron.Spec( '*/10 * * * * *' ), function () {
  console.log('running job');
});
``` 


```javascript

/**
  * @param {string|Cron.Spec} spec spec can be a Cron.Spec object or just a plain string.
  * @param {Function} block block must be a function.
  */
Cron.Job( spec, block );
``` 


## Syntax:

The general syntax for cron.js looks like this:

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
  _eg. `0-10/2` would indicate every 2nd number from 0 to 10, therefore [0,2,4,6,8,10]_

### Lists
  Lists are either ranges, numbers, or intervals seperated by commas. eg. `10-30,23,30-40/2`;


You should combind these six columns to specify a interval at which a job object is to be run:

```javascript
var schedule = "0 0 0 * * 2-6"; // 00:00:00 on every weeday
new Cron.Job( schedule, function () {
  // do stuff here
});
``` 
