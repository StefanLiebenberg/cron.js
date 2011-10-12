goog.provide('sage.cron.syntax.SingleParser');
goog.require('sage.util.StringParser');



/**
 * @constructor
 * @extends {sage.util.StringParser}
 * @param {string} allow Allowable string in parser.
 */
sage.cron.syntax.SingleParser = function(allow) {
  var regexp = new RegExp('^' + this.allow + '$');
  goog.base(this, regexp);
};
goog.inherits(sage.cron.syntax.SingleParser, sage.util.StringParser);


/**
 * @param {string} spec the specification string.
 * @param {sage.cron.SpecParser} parser the spec_parser.
 * @return {Array.<number>} return an array of numbers.
 */
sage.cron.syntax.SingleParser.prototype.parseInternal = function(spec, parser) {
  var at = parseInt(spec) - parser.range.from;
  return parser.range.valueAt(at);
};
