goog.provide('slieb.util.RangeParser');
goog.require('goog.array');
goog.require('slieb.util.Range');
goog.require('slieb.util.array');



/**
 * @constructor
 * @param {number} from the start point.
 * @param {number} to the end point.
 */
slieb.util.RangeParser = function(from, to) {
  this.range = new slieb.util.Range(from, to);
  this.parsers = [];
};


/** @type {slieb.util.Range} */
slieb.util.RangeParser.prototype.range;


/** @type {Array.<slieb.cron.syntax.AbstractParser>} */
slieb.util.RangeParser.prototype.parsers;


/**
 * @param {string} string
 * @return {!Array.<number>}
 */
slieb.util.RangeParser.prototype.parse = function(string) {
  var len = this.parsers.length;

  /** @type {!Array.<number>} */
  var result = [];

  /** @type {slieb.cron.syntax.AbstractParser} */
  var parser;

  for (var i = 0; i < len; i++) {
    parser = this.parsers[i];
    if (parser.test(string)) {
      result = parser.parse(string);
      slieb.util.array.uniq(result);
      result.sort(function(a, b) {return a - b});
      break;
    }
  }

  return result;
};
