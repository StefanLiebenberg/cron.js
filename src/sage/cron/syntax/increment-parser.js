goog.provide('sage.cron.syntax.IncrementParser');
goog.require('sage.cron.syntax.AbstractParser');



/**
 * @constructor
 * @extends {sage.cron.syntax.AbstractParser}
 * @param {sage.cron.SpecParser} parser
 */
sage.cron.syntax.IncrementParser = function(parser) {
  goog.base(this, parser, new RegExp('^[^\/]+\/' + parser.allow + '$'));
};
goog.inherits(sage.cron.syntax.IncrementParser,
              sage.cron.syntax.AbstractParser);

/**
 *  @type {sage.cron.SpecParser}
 */
sage.cron.syntax.IncrementParser.prototype.parser;


/** @override */
sage.cron.syntax.IncrementParser.prototype.parse = function(spec) {
  var parts = /** @type {Array.<string>} */ (spec.split('/'));
  var range = /** @type {Array.<number>} */ (this.parser.parse(parts[0]));
  var increment = /** @type {number} */ (parseInt(parts[1], 10));
  /** @type {!Array.<number>} */
  var result = [];
  for (var i = 0, l = range.length; i < l; i += increment) {
    result.push(range[i]);
  }
  return result;
};

