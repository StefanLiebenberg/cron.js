goog.provide('sage.cron.syntax.RangeParser');
goog.require('sage.util.StringParser');



/**
 * @constructor
 * @extends {sage.util.StringParser}
 * @param {string} allow Allowable string in parser.
 */
sage.cron.syntax.RangeParser = function(allow) {
  var regexp = new RegExp('^' + allow + '-' + allow + '$');
  goog.base(this, regexp);
};
goog.inherits(sage.cron.syntax.RangeParser, sage.util.StringParser);


/**
 * @override {sage.util.StringParser.prototype.parse}
 * @param {string} spec the specification string.
 * @param {sage.cron.SpecParser} parser the spec_parser.
 * @return {Array.<number>} return an array of numbers.
 */
sage.cron.syntax.RangeParser.prototype.parse;


/**
 * @param {string} spec the specification string.
 * @param {sage.cron.SpecParser} parser the spec_parser.
 * @return {Array.<number>} return an array of numbers.
 */
sage.cron.syntax.RangeParser.prototype.parseInternal = function(spec, parser) {
  var parts = spec.split('-');
  var startAt = parseInt(parts[0], 10) - parser.range.from;
  var endAt = parseInt(parts[1], 10) - parser.range.from;
  return parser.range.getValues(null, null).slice(startAt, endAt + 1);
};
