goog.provide('sage.cron.syntax.RangeParser');
goog.require('sage.cron.syntax.AbstractParser');



/**
 * @constructor
 * @extends { sage.cron.syntax.AbstractParser}
 * @param {sage.cron.SpecParser} parser
 */
sage.cron.syntax.RangeParser = function(parser) {
  goog.base(this, parser,
            new RegExp('^' + parser.allow + '-' + parser.allow + '$'));
};
goog.inherits(sage.cron.syntax.RangeParser, sage.cron.syntax.AbstractParser);


/** @override */
sage.cron.syntax.RangeParser.prototype.parse = function(spec) {
  var parts = spec.split('-');
  var startAt = parseInt(parts[0], 10) - this.parser.range.from;
  var endAt = parseInt(parts[1], 10) - this.parser.range.from;
  return this.parser.range.getValues(null, null).slice(startAt, endAt + 1);
};
