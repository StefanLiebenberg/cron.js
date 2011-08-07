var CronScheduler = function () {
  this.jobs = [];
  this.running = false;
};


CronScheduler.prototype = {
  add: function ( job ) {
    this.jobs.push( job );
    if( this.running ) {
      this.next();
    };  
  },
  remove: function ( job ) {
    var idx;    
    while( ( idx = this.jobs.indexOf(obj) ) != -1 ) {
      this.jobs.splice( idx );
    };
  },
  start: function () {
    if(!this.running){
      this.running = true;
      this.next();
    };
  },
  stop: function () {
    if( this.running ) {
      this.running = false;
      clearTimeout( this.storedTimeout );
      delete this.storedTimeout;
    };
  },
  next: function () {
    if( !this.running || this.storedTimeout || !this.jobs.length ) {
      return;
    };
    
    var job = this.jobs[0];
    for( var i = 1, l = this.jobs.length; i < l; i++ ) {
      if( this.jobs[i].next_at < job.next_at ) {
        job = this.jobs[i];
      };
    };
    
    var self = this;
    this.storedTimeout = setTimeout( function () {
      job.run();
      delete self.storedTimeout;
      self.next();
    }, job.getTimeout() );
  }
};
