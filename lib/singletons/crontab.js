var Crontab = new function () {
  // ensure singleton;
  if( this.constructor.instance ) return this.constructor.instance;
  this.constructor.instance = this;
  
  var jobs = this.jobs = [];
  
  this.add = function( job ) {
    jobs.push( job );
    if( this.running ) {
      this.next();
    };
  };
  
  this.remove = function ( job ) {
    // todo, add remove code
  };
  
  this.next = function () {
    if( !this.running || this.storedTimeout || !jobs.length ) {
      return;
    };
    
    var job = jobs[0];
    for( var i = 1, l = jobs.length; i < l; i++ ) {
      if( jobs[i].next_at < job.next_at ) {
        job = jobs[i];
      }
    };
    
    var self = this;
    this.storedTimeout = setTimeout( function () {
      job.run();
      delete self.storedTimeout;
      self.next();
    }, job.getTimeout() );
  };
  
  this.start = function () {
    if(! this.running ) {
      this.running = true;
      this.next();
    }
  };
  this.stop = function () {
    if(this.running ) {
      this.running = false;
      clearTimeout( this.storedTimeout );
      delete this.storedTimeout;
    };
  };
};
