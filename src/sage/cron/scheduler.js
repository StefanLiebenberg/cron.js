goog.provide('sage.cron.Scheduler');
goog.require('sage.cron.Job');



/**
 * the cron scheduler
 * @constructor
 */
sage.cron.Scheduler = function() {
  /**
   * @private
   * @type {Array.<sage.cron.Job>}
   */
  this.jobs_ = [];

  /**
   * @type {boolean}
   * @private
   */
  this.running_ = false;
};


/**
 * @param {sage.cron.Job} job a cron job to add.
 * @return {undefined} returns nothing.
 */
sage.cron.Scheduler.prototype.add = function(job) {
  this.jobs_.push(job);
  /*
  if (this.running_) {
    this.next();
  }*/
};


/**
 * @param {sage.cron.Job} job the job to remove.
 * @return {undefined} returns nothing.
 */
sage.cron.Scheduler.prototype.remove = function(job) {
  /** @type {number} */
  var index;
  while ((index = this.jobs.indexOf(job)) !== -1) {
    this.jobs_.splice(index);
  }
};


/**
 * @return {undefined} returns nothing.
 */
sage.cron.Scheduler.prototype.start = function() {
  if (!this.running_) {
    this.running_ = true;
    this.next();
  }
};


/**
 * @return {undefined} returns nothing.
 */
sage.cron.Scheduler.prototype.stop = function() {
  if (this.running_) {
    this.running_ = false;
    clearTimeout(this.stored_timeout_);
    delete this.stored_timeout_;
  }
};


/**
 * @return {undefined} returns nothing.
 */
sage.cron.Scheduler.prototype.next = function() {

  /** @type {boolean} */
  var stop = !this.running_ || this.stored_timeout_ || this.jobs_.length === 0;
  if (stop) {
    return;
  }

  /** @type {sage.cron.Job} */
  var job = this.jobs_[0];
  for (var i = 1, l = this.jobs_.length; i < l; i++) {
    if (this.jobs_[i].next_at < job.next_at) {
      job = this.jobs_[i];
    }
  }

  var self = this;
  this.storedTimeout = setTimeout(function() {
    job.run();
    delete self.storedTimeout;
    self.next();
  }, job.getNextTimeout());
};
