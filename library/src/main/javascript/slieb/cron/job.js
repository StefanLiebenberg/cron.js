goog.provide('slieb.cron.Job');
goog.require('goog.asserts');



/**
 * @constructor
 * @param {!string|!slieb.cron.Spec} spec
 *        The interval specification.
 * @param {!Function} block
 *        The function associated with this cron.
 */
slieb.cron.Job = function(spec, block) {
  this.cronspec_ = slieb.cron.Job.toSpec_(spec);
  this.block_ = block;
  this.last_at = null;
  this.calcNextAt_();
};


/**
 * @private
 * @type {!slieb.cron.Spec}
 */
slieb.cron.Job.prototype.cronspec_;


/**
 * @private
 * @type {!Function}
 */
slieb.cron.Job.prototype.block_;


/**
 * @type {?Date}
 */
slieb.cron.Job.prototype.last_at;


/**
 * @private
 * @param {!string|!slieb.cron.Spec} spec
 * @return {!slieb.cron.Spec}
 */
slieb.cron.Job.toSpec_ = function(spec) {
  if (goog.isString(spec)) {
    return new slieb.cron.Spec(spec);
  } else {
    goog.asserts.assert(spec instanceof slieb.cron.Spec);
    return spec;
  }
};


/**
 * @private
 * @return {undefined} returns nothing.
 */
slieb.cron.Job.prototype.calcNextAt_ = function() {
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
slieb.cron.Job.prototype.getNextTimeout = function(date) {
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
slieb.cron.Job.prototype.run = function() {
  this.last_at = new Date();
  setTimeout(this.block_, 10);
  this.calcNextAt_();
};

