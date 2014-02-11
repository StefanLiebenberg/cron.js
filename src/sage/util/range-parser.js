goog.provide('sage.util.RangeParser');
goog.require('goog.array');
goog.require('sage.util.Range');
goog.require('sage.util.array');



/**
 * @constructor
 * @param {number} from the start point.
 * @param {number} to the end point.
 */
sage.util.RangeParser = function(from, to) {
  this.range = new sage.util.Range(from, to);
  this.parsers = [];
};


/** @type {sage.util.Range} */
sage.util.RangeParser.prototype.range;


/** @type {Array.<sage.cron.syntax.AbstractParser>} */
sage.util.RangeParser.prototype.parsers;


/**
 * @param {string} string
 * @return {!Array.<number>}
 */
sage.util.RangeParser.prototype.parse = function(string) {
  var len = this.parsers.length;

  /** @type {!Array.<number>} */
  var result = [];

  /** @type {sage.cron.syntax.AbstractParser} */
  var parser;

  for (var i = 0; i < len; i++) {
    parser = this.parsers[i];
    if (parser.test(string)) {
      result = parser.parse(string);
      sage.util.array.uniq(result);
      result.sort(function(a, b) {return a - b});
      break;
    }
  }

  return result;
};
