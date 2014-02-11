goog.provide('sage.cron.Job');
goog.require('goog.asserts');



/**
 * @constructor
 * @param {!string|!sage.cron.Spec} spec
 *        The interval specification.
 * @param {!Function} block
 *        The function associated with this cron.
 */
sage.cron.Job = function(spec, block) {
  this.cronspec_ = sage.cron.Job.toSpec_(spec);
  this.block_ = block;
  this.last_at = null;
  this.calcNextAt_();
};


/**
 * @private
 * @type {!sage.cron.Spec}
 */
sage.cron.Job.prototype.cronspec_;


/**
 * @private
 * @type {!Function}
 */
sage.cron.Job.prototype.block_;


/**
 * @type {?Date}
 */
sage.cron.Job.prototype.last_at;


/**
 * @private
 * @param {!string|!sage.cron.Spec} spec
 * @return {!sage.cron.Spec}
 */
sage.cron.Job.toSpec_ = function(spec) {
  if (goog.isString(spec)) {
    return new sage.cron.Spec(spec);
  } else {
    goog.asserts.assert(spec instanceof sage.cron.Spec);
    return spec;
  }
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
    temp = /** @type {Date} */ (this.cronspec_.next(this.last_at));
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
 * @param {?Date} date get the timeout from date.
 * @return {number} returns the timeout value.
 */
sage.cron.Job.prototype.getNextTimeout = function(date) {
  if (!date) {
    date = new Date();
  }

  if (!this.next_at) {
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

