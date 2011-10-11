goog.provide('sage.util.RangeParser');
goog.require('sage.util.Parser');
goog.require('sage.util.Range');
goog.require('sage.util.array');



/**
 * @constructor
 * @extends {sage.util.Parser}
 */
sage.util.RangeParser = function(from, to) {
  this.range = new sage.util.Range(from, to);
  this.parsers = [];
};
goog.inherits(sage.util.RangeParser, sage.util.Parser);


/**
 * @param {sage.cron.CronSpec} spec the spec.
 */
sage.util.RangeParser.prototype.parse = function(spec) {
  /** @type {Array} */
  var result = [];
  for (var i = 0, l = this.parsers.length; i < l; i++) {
    if (this.parsers[i].test(spec)) {
      var result = this.parsers[i]
        .parse(spec, this);
      sage.util.array(result);
      result.sort(function(a,b) {return a - b});
      return result;
    }
  }
  return [];
};
