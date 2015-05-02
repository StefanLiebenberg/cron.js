goog.provide('sage.cron.syntax.SingleParser');
goog.require('sage.cron.syntax.AbstractParser');



/**
 * @constructor
 * @extends {sage.cron.syntax.AbstractParser}
 * @param {sage.cron.SpecParser} parser
 */
sage.cron.syntax.SingleParser = function(parser) {
  goog.base(this, parser, new RegExp('^' + parser.allow + '$'));
};
goog.inherits(sage.cron.syntax.SingleParser, sage.cron.syntax.AbstractParser);


/** @override */
sage.cron.syntax.SingleParser.prototype.parse = function(spec) {
  var range = this.parser.range;
  var at = parseInt(spec, 10) - range.from;
  return [range.valueAt(at)];
};
