/**
 * Simple Cron Scheduler for Javascript
 * 
 *   Seconds  Minutes Hours DaysOfMonth Months DaysOfWeek
 * ===========================================
 *     0       *       *     *           *      *       ( Every minute of every Day )
 *     0      0-30    1,2   1-10        *      1       ( Every minute for the first 30 minutes during the 1st and 2nd hours on every sunday )
 * 
 */


window['CronSpec'] = new function () {
   
 function Range( from, to ) {
   this.from = from; this.to = to;
   for( var a = from; a <= to; a++ )
     this.push(a);
 };
 Range.prototype = [];
 
 function Parser( match, block ) {
   this.matcher = match;
   this.block   = block;
 };
 
 Parser.prototype =  {
   test: function ( spec ) {
     return this.matcher.test( spec )
   },
   parse: function ( spec, base ) {
     return this.block.call( this, spec, base )
   }
 };
 
 function RangeParser( from, to ) {
   this.range   = new Range( from, to );
   this.parsers = [];
 };
 
 RangeParser.prototype.parse = function ( spec ) {
   for( var i = 0, l = this.parsers.length; i < l; i++ ) {
     if( this.parsers[i].test( spec ) ) {
       var result = this.parsers[i]
        .parse( spec, this );
      result.uniq();
      result.sort(function(a,b){return a -b});
      return result;
     };
   };
   return [];
 };
 
  function Base ( from, to, allowable_string ) {
    this.allow = allowable_string;
    // rebuild range;
    this.range   = new Range( from, to )
    this.parsers = new Array();
    this.aliases = {};
    // coma "x,x"
    this.parsers.push( new Parser( /\,/,Base.methods.comma ));
    this.parsers.push( new Parser( /^\*$/, Base.methods.all ) );
    this.parsers.push( new Parser( new RegExp("^" +this.allow+ "$"), Base.methods.single )  );
    this.parsers.push( new Parser( new RegExp( "^"+this.allow+"-"+this.allow+"$"), Base.methods.range ));
    this.parsers.push( new Parser( new RegExp( "^[^\/]+\/"+this.allow+"$" ), Base.methods.increment ));
 };
  Base.prototype = new RangeParser( 0, 0 );
  Base.methods   = {
    all   : function ( spec, base ) {
      return base.range.slice();
    },
    comma : function(spec, base) {
      var parts = spec.split(",");
      var result = [];
      for(var i = 0; i < parts.length; i++ ) {
        result.push.apply( result, base.parse( parts[i] ) );
      };
      return result;
    },
    single : function ( spec, base) {      
      var at = parseInt( spec ) - base.range.from;
      return base.range.slice( at, at + 1 );
    },
    range  : function ( spec, base ) {
      var parts = spec.split("-");
      var startAt = parseInt( parts[0] ) - base.range.from;
      var endAt   = parseInt( parts[1] ) - base.range.from;
      return base.range.slice( startAt, endAt + 1 );
    },
    increment: function ( spec, base ) {
      var parts = spec.split( "/" );
      var range = base.parse( parts[0]  );
      var increment = parseInt( parts[1] );
      var result = [];
      for( var i = 0, l = range.length; i < l; i+= increment ) {
        result.push( range[i] );
      };
      return result;
    }
 };
 
 var Seconds  = new Base( 0, 59, "[1-5]?[0-9]"                           );
 var Minutes  = new Base( 0, 59, "[1-5]?[0-9]"                           );
 var Hours    = new Base( 0, 23, "(([0-1]?[0-9])|([2][0-3]))"            );
 var Days     = new Base( 1, 31, "(([0]?[1-9])|([1-2][0-9])|([3][0-1]))" );
 var Months   = new Base( 1, 12, "(([0]?[1-9])|([1][0-2]))"              );
 var Weekdays = new Base( 1, 7,  "([0]?[1-7])"                           );
 
 
 Months.aliases = {
   "jan": 1,
   "feb": 2,
   "mar": 3,
   "apr": 4,
   "may": 5,
   "jun": 6,
   "jul": 7,
   "aug": 8,
   "sep": 9,
   "oct": 10,
   "nov": 11,
   "dec": 12
 };
 
 Weekdays.aliases = {
   "sun": 1, 
   "mon": 2,
   "tue": 3, 
   "wed": 4,
   "thu": 5,
   "fri": 6,
   "sat": 7
 };
 
  var alias_parser = new Parser( /([a-z][a-z][a-z])|([A-Z][A-Z][A-Z])/g, function( spec, base) {
   spec = spec.replace( this.matcher, function ( string ) {
     string = string.toLowerCase();
     if( string in base.aliases ) {
       string = base.aliases[string];
     };
     return string
   });
   return base.parse(spec);
 })
 
 Months.parsers.push( alias_parser );
 Weekdays.parsers.push( alias_parser );
 
 var aliases = {
   "@second"     : "* * * * * *",   //on every second
   "@minute"     : "0 * * * * *",   //at x:00 for every minute x
   "@halfminute" : "0,30 * * * * *",//at x:00 and x:30 for every minute x
   "@hour"       : "0 0 * * * *",   //at x:00:00 for every hour x
   "@halfhour"   : "0 0,30 * * *",  //at x:00:00 and x:30:00 for every hour x
   "@daily"      : "0 0 0 * * *",   //at midnight of every day
   "@monthly"    : "0 0 0 1 * *",   //at the first of every month, 00:00:00
   "@yearly"     : "0 0 0 1 1 *",   //at 1Jan 00:00:00 every year
   "@weekly"     : "0 0 0 * * 1",   //on sunday 00:00:00 every week
   "@weekday"    : "0 0 0 * * 2-6"  //midnight on every weekday
 };

 this.parse = function ( spec ) {
   
   spec = spec.trim( " " )
   
   if( spec in aliases ) {
     spec = aliases[spec];
   };
   
   var parts = spec.trim().split(" ");

   if( parts.length != 6 ) {
     throw new Error( "CronSpec only accepts cronstrings with 6 parts: " + spec + " is invalid" );
   };
   return {
     spec     : spec,
     seconds  : Seconds.parse( parts[0] ),
     minutes  : Minutes.parse( parts[1] ),
     hours    : Hours.parse(   parts[2] ),
     days     : Days.parse(    parts[3] ),
     months   : Months.parse(  parts[4] ),
     weekdays : Weekdays.parse(parts[5] )
   };
 };
 
 
 
 this.next = function( date, cronspec ) {
   var next = new Date( date.getTime() + 1000 );
   next.setMilliseconds( 0 );
   
   var len_seconds = cronspec.seconds.length;
   var do_seconds = len_seconds && len_seconds != 60;
   
   var len_minutes = cronspec.minutes.length;
   var do_minutes = len_minutes && len_minutes != 60;
   
   var len_hours = cronspec.hours.length;
   var do_hours  = len_hours && len_hours != 24;
   
   var len_weekdays = cronspec.weekdays.length;
   var do_weekdays  = len_weekdays && len_weekdays != 7;
   
   var len_days = cronspec.days.length;
   var do_days  = len_days && len_days.length != 31;
   
   var len_months = cronspec.months.length;
   var do_months  = len_months && len_months != 12;
   
   var done = false;
   while( ! done ) {
     
     var s = next.getSeconds();
     if( do_seconds && cronspec.seconds.indexOf( s ) == -1 ) {
       var second_flag = true;
       for( var i = 0; i < len_seconds; i++ ) {
         if( cronspec.seconds[i] >= s ) {
           next.setSeconds( cronspec.seconds[i] );
           second_flag = false;
           break;
         };
       };
       if( second_flag ) {
         next.setSeconds( 0 );
         next.addMinutes( 1 );
       };
       continue;
     };
     
     
     var m = next.getMinutes();
     if( do_minutes && cronspec.minutes.indexOf( m ) == -1 ) {
       var minute_flag = true;
       for( var i = 0; i < len_minutes; i++ ) {
         if( cronspec.minutes[i] >= m ) {
           next.setMinutes( cronspec.minutes[i] );
           minute_flag = false;
           break;
         };
       };
       if(minute_flag){
         next.setMinutes(0);
         next.addHours(1);
       };
       continue;
     };
     
     var h = next.getHours();
     if( do_hours && cronspec.hours.indexOf( h ) == -1 ) {
       var hour_flag = true;
       for( var i = 0; i < len_hours; i++ ) {
         if( cronspec.hours[i] >= h ) {
           next.setHours( cronspec.hours[i] );
           hour_flag = false;
           break;
         }
       };
       if( hour_flag ) {
         next.addDays(1);
         
         next.setSeconds(0);
         next.setMinutes(0);
         next.setHours(0);
         continue;
       };
     };
     
     var w = next.getDay() + 1;
     if( do_weekdays && cronspec.weekdays.indexOf( w ) == -1 ) {
       var weekday_flag = true;
       for( var i = 0; i < len_weekdays; i++ ) {
         if( cronspec.weekdays[i] >= w ) {
           var delta = cronspec.weekdays[i] - w;
           next.addDays( delta - 1 );
           // set date
           weekday_flag = false;
           break;
         };
       };
       if( weekday_flag ) {
         next.addDays(8 - w) // add delta
         next.setSeconds( 0 );
         next.setMinutes(0);
         next.setHours(0);

         continue;
       };
     };
     
     var d = next.getDate();
     if( do_days && cronspec.days.indexOf( d ) == -1 ) {
       var day_flag = true;
       for( var i = 0; i < len_days; i++ ) {
         if( cronspec.days[i] >= d ) {
           while( next.getDate() != cronspec.days[i] )
              next.setDate( cronspec.days[i] );
           day_flag = false;
           break;
         };
       };
       next.setSeconds( 0 );
       next.setHours(0);
       next.setMinutes(0);
       if( day_flag ) {
         next.setDate(1)
         next.addMonths(1);
       };
       continue;
     };
     
     var m = next.getMonth() + 1;
     if( do_months && cronspec.months.indexOf( m ) == -1 ) {
       var month_flag = true;
       for( var i = 0; i < len_months; i++ ) {
         if( cronspec.months[i] >= m ) {
           next.setMonth( cronspec.months[i] - 1);
           month_flag = false;
           break;
         };
       };
       next.setSeconds( 0 );
       next.setMinutes(0);
       next.setHours(0);
       next.setDate(1);
       if( month_flag ) {
         next.setMonth(0);
         next.addYears(1);
       };
       continue;
     };
     done = true;
   };
   
   return next;
 }
 

 
 return;
};
