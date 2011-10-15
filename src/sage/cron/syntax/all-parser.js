goog.provide('sage.cron.syntax.AllParser');
goog.require('sage.util.StringParser');



/**
 * @constructor
 * @extends {sage.util.StringParser}
 */
sage.cron.syntax.AllParser = function() {
  var regexp = /^\*$/;
  goog.base(this, regexp);
};
goog.inherits(sage.cron.syntax.AllParser, sage.util.StringParser);


/**
 * @override {sage.util.StringParser.prototype.parse}
 * @param {string} spec the specification string.
 * @param {sage.cron.SpecParser} parser the spec_parser.
 * @return {Array.<number>} return an array of numbers.
 */
sage.cron.syntax.AllParser.prototype.parse;


/**
 * @param {string} spec the specification string.
 * @param {sage.cron.SpecParser} parser the spec_parser.
 * @return {Array.<number>} return an array of numbers.
 */
sage.cron.syntax.AllParser.prototype.parseInternal = function(spec, parser) {
  return parser.range.getValues(null, null);
};
