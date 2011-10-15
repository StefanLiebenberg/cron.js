goog.provide('sage.util.RangeParser');
goog.require('sage.util.Parser');
goog.require('sage.util.Range');
goog.require('sage.util.array');



/**
 * @constructor
 * @extends {sage.util.Parser}
 * @param {number} from the start point.
 * @param {number} to the end point.
 */
sage.util.RangeParser = function(from, to) {
  /** @type {sage.util.Range} */
  this.range = new sage.util.Range(from, to);

  /** @type {Array.<sage.util.StringParser>} */
  this.parsers = [];
};
goog.inherits(sage.util.RangeParser, sage.util.Parser);


/**
 * @param {string} string a range string to parse.
 * @return {Array} returns an array of parsed values.
 */
sage.util.RangeParser.prototype.parseInternal = function(string) {

  var result = /** @type {Array} */ [];
  var len = /** @type {number} */ this.parsers.length;
  var parser, result;

  for (var i = 0; i < len; i++) {
    parser = /** @type {sage.util.Parser} */ this.parsers[i];
    if (parser.test(string)) {
      result = parser.parse(string, this);
      sage.util.array.uniq(result);
      result.sort(function(a, b) {return a - b});
      break;
    }
  }
  return result;
};
