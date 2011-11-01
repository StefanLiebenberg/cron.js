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

  /**
   * @private
   * @type {number|undefined}
   */
  this.stored_timeout_ = undefined;
};


/**
 * @param {sage.cron.Job} job a cron job to add.
 * @return {undefined} returns nothing.
 */
sage.cron.Scheduler.prototype.add = function(job) {
  this.jobs_.push(job);
  if (this.running_) {
    this.next();
  }
};


/**
 * Tolerance level for skipped dates.
 * @private
 * @type {number}
 */
sage.cron.Scheduler.prototype.tolerance_ = 1000;


/**
 * Checks that cron is still running if it needs to be.
 */
sage.cron.Scheduler.prototype.check = function() {
  // if running is false then we do nothing.
  if (this.running_) {
    var next = this.next_scheduled_at_;
    var now = new Date() - this.tolerance_;
    if (next < now) {
      this.restart();
    }
  }
};


/**
 * @param {sage.cron.Job} job the job to remove.
 * @return {undefined} returns nothing.
 */
sage.cron.Scheduler.prototype.remove = function(job) {
  /** @type {number} */
  var index;
  while ((index = this.jobs_.indexOf(job)) !== -1) {
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
    this.startCheck_();
  }
};


/**
 * @private
 */
sage.cron.Scheduler.prototype.startCheck_ = function() {
  if (!this.stored_interval_) {
    this.stored_interval_ = setInterval(this.check.bind(this), 60000);
  }
};


/**
 * @private
 */
sage.cron.Scheduler.prototype.stopCheck_ = function() {
  if (this.stored_interval_) {
    clearInterval(this.stored_interval_);
  }
};


/**
 * @return {undefined} returns nothing.
 */
sage.cron.Scheduler.prototype.restart = function() {
  this.stop();
  this.start();
};


/**
 * @return {undefined} returns nothing.
 */
sage.cron.Scheduler.prototype.stop = function() {
  if (this.running_) {
    this.running_ = false;
    this.clearTimeout_();
    this.stopCheck_();
  }
};


/**
 * @return {undefined} returns nothing.
 */
sage.cron.Scheduler.prototype.next = function() {

  /** @type {boolean} */
  var stop = !this.running_;
  stop = stop || Boolean(this.stored_timeout_);
  stop = stop || !Boolean(this.jobs_.length);

  if (stop) {
    return;
  }

  /** @type {sage.cron.Job} */
  var job = this.getNextJob();
  this.executeJob_(job);

};


/**
 * @param {sage.cron.Job} job job to execute.
 * @private
 */
sage.cron.Scheduler.prototype.executeJob_ = function(job) {

  var now = new Date();
  var timeout = job.getNextTimeout(null);
  var next = new Date(now.getTime() + timeout);

  this.next_scheduled_at_ = next;
  this.setTimeout_(function() {
    job.run();
    this.clearTimeoutValue_();
    delete this.next_scheduled_at_;
    this.next();
  }, timeout);
};


/**
 * @private
 * @param {Function} block function to timeout.
 * @param {number} timeout number of ms to timeout.
 */
sage.cron.Scheduler.prototype.setTimeout_ = function(block, timeout) {
  var stored = setTimeout(goog.bind(block, this), timeout);
  this.setTimeoutValue_(stored);
};


/**
 * @private
 */
sage.cron.Scheduler.prototype.clearTimeout_ = function() {
  var stored = this.getTimeoutValue_();
  clearTimeout(stored);
  this.clearTimeoutValue_();
};


/**
 * @private
 * @param {number} timeout a timeout number to store.
 */
sage.cron.Scheduler.prototype.setTimeoutValue_ = function(timeout) {
  this.stored_timeout_ = timeout;
};


/**
 * @private
 * @return {number|undefined} returns stored timeout value.
 */
sage.cron.Scheduler.prototype.getTimeoutValue_ = function() {
  return this.stored_timeout_;
};


/**
 * @private
 */
sage.cron.Scheduler.prototype.clearTimeoutValue_ = function() {
  delete this.stored_timeout_;
};


/**
 * @return {sage.cron.Job} returns the next job.
 */
sage.cron.Scheduler.prototype.getNextJob = function() {
  var min = this.jobs_[0];
  for (var job, i = 1, l = this.jobs_.length; i < l; i++) {
    job = this.jobs_[i];
    if (job.next_at < min.next_at) {
      min = job;
    }
  }
  return min;
};
