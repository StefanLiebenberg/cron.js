goog.provide('slieb.cron.syntax.IncrementParser');
goog.require('slieb.cron.syntax.AbstractParser');



/**
 * @constructor
 * @extends {slieb.cron.syntax.AbstractParser}
 * @param {slieb.cron.SpecParser} parser
 */
slieb.cron.syntax.IncrementParser = function(parser) {
  slieb.cron.syntax.RangeParser.base(this, 'constructor', parser, new RegExp('^[^\/]+\/' + parser.allow + '$'));
};
goog.inherits(slieb.cron.syntax.IncrementParser,
              slieb.cron.syntax.AbstractParser);

/**
 *  @type {slieb.cron.SpecParser}
 */
slieb.cron.syntax.IncrementParser.prototype.parser;


/** @override */
slieb.cron.syntax.IncrementParser.prototype.parse = function(spec) {
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

