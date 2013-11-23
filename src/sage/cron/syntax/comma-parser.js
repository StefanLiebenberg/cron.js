goog.provide('sage.cron.syntax.CommaParser');
goog.require('sage.cron.syntax.AbstractParser');



/**
 * @constructor
 * @extends { sage.cron.syntax.AbstractParser}
 * @param {sage.cron.SpecParser} parser
 */
sage.cron.syntax.CommaParser = function(parser) {
  goog.base(this, parser, /\,/);
};
goog.inherits(sage.cron.syntax.CommaParser, sage.cron.syntax.AbstractParser);


/** @override */
sage.cron.syntax.CommaParser.prototype.parse = function(spec) {

  /** @type {Array.<string>} */
  var parts = spec.split(',');
  /** @type {number} */
  var len = parts.length;
  /** @type {!Array.<number>} */
  var results = [];

  for (var i = 0; i < len; i++) {
    results.push.apply(results, this.parser.parse(parts[i]));
  }

  return results;
};
