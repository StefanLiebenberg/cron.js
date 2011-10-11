goog.provide('sage.util.Parser');



/**
 * @constructor
 * @param {RegExp} match the parser regex.
 * @param {Function} block the excecution block.
 */
sage.util.Parser = function(match, block) {
  this.matcher = match;
  this.block = block;
};


/**
 * @param {CronSpec} spec the spec.
 * @return {boolean} test result.
 */
sage.util.Parser.prototype.test = function(spec) {
  return this.matcher.test(spec);
};


/**
 * @param {CronSpec} spec the spec.
 * @param {Object|*} base the base.
 * @return {*} not really sure atm.
 */
sage.util.Parser.prototype.parse: function(spec, base) {
  return this.block.call(this, spec, base);
};
