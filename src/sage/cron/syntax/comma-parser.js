goog.provide('sage.cron.syntax.CommaParser');
goog.require('sage.util.StringParser');



/**
 * @constructor
 * @extends {sage.util.StringParser}
 */
sage.cron.syntax.CommaParser = function() {
  var regexp = /\,/;
  goog.base(this, regexp, this.parseInternal);
};
goog.inherits(sage.cron.syntax.CommaParser, sage.util.StringParser);


/**
 * @param {string} spec the specification string.
 * @param {sage.cron.SpecParser} parser the spec_parser.
 * @return {Array.<number>} return an array of numbers.
 */
sage.cron.syntax.CommaParser.prototype.parseInternal = function(spec, parser) {

  var parts, results, len;

  /** @type {Array.<string>} */
  parts = spec.split(',');
  /** @type {number} */
  len = parts.length;
  /** @type {Array.<number>} */
  results = [];

  for (var i = 0; i < len, i++) {
    results.push.apply(result, parser.parse(parts[i]));
  }
  return results;
};
