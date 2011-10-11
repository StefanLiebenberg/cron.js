

// These extentions are required for the interals of cron.js to function.
Date.prototype.addTime = function ( time ) {
  this.setTime( this.getTime() + time );
};
Date.prototype.addMinutes = function ( minutes ) {
  this.setMinutes( this.getMinutes() + minutes )
};
Date.prototype.addHours = function ( hours ) {
  this.setHours( this.getHours() + hours );
};
Date.prototype.addDays = function ( days ) {
  this.setDate( this.getDate() + days );
};
Date.prototype.addMonths = function ( months ) {
  this.setMonth( this.getMonth() + months ); 
};

Date.prototype.addYears = function ( years ) {
  this.setFullYear( this.getFullYear() + years );
}

Array.prototype.uniq = function () {
 for( var i = 0, l = this.length; i < l; i++ ) {
   var value = this[i], at = i + 1;
   while( ( at = this.indexOf( value, at ) ) != -1 ) {
     this.splice( at, 1 ); l--;
   };
 };
 return this;
};
