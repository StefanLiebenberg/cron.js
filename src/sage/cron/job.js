goog.provide('sage.cron.Job');



/**
 * @constructor
 * @param {!string|!sage.cron.Spec} spec the interval specification.
 * @param {!Function} block the function associated with this cron.
 */
sage.cron.Job = function(spec, block) {
  if (typeof spec === 'string') {
    spec = new sage.cron.Spec(spec);
  }

  /**
   * @type {!sage.cron.Spec}
   * @private
   */
  this.cronspec_ = spec;

  /**
   * @type {!Function}
   * @private
   */
  this.block_ = block;

  /**
   * @type {?Date}
   */
  this.last_at = null;

  this.calcNextAt_();

};


/**
 * @private
 * @return {undefined} returns nothing.
 */
sage.cron.Job.prototype.calcNextAt_ = function() {
  /** @type {Date} */
  var now = new Date();
  /** @type {Date|undefined} */
  var temp;
  if (this.last_at) {
    temp = /** @type {Date} */ this.cronspec_.next(this.last_at);
    while (temp < now) {
      temp = this.cronspec_.next(temp);
    }
  } else {
    temp = this.cronspec_.next(now);
  }

  /** @type {Date} */
  this.next_at = temp;
};


/**
 * @param {Date|undefined} date get the timeout from date.
 * @return {number} returns the timeout value.
 */
sage.cron.Job.prototype.getNextTimeout = function(date) {
  if (!date) {
    date = new Date();
  }

  if (! this.next_at) {
    this.calcNextAt_();
  }

  return Math.max(10, this.next_at - date);
};


/**
 * @return {undefined} returns nothing.
 */
sage.cron.Job.prototype.run = function() {
  this.last_at = new Date();
  setTimeout(this.block_, 10);
  this.calcNextAt_();
};

