goog.provide('slieb.cron.syntax.RangeParser');
goog.require('slieb.cron.syntax.AbstractParser');



/**
 * @constructor
 * @extends { slieb.cron.syntax.AbstractParser}
 * @param {slieb.cron.SpecParser} parser
 */
slieb.cron.syntax.RangeParser = function(parser) {
  slieb.cron.syntax.RangeParser.base(this, 'constructor', parser,
            new RegExp('^' + parser.allow + '-' + parser.allow + '$'));
};
goog.inherits(slieb.cron.syntax.RangeParser, slieb.cron.syntax.AbstractParser);


/** @override */
slieb.cron.syntax.RangeParser.prototype.parse = function(spec) {
  var parts = spec.split('-');
  var startAt = parseInt(parts[0], 10) - this.parser.range.from;
  var endAt = parseInt(parts[1], 10) - this.parser.range.from;
  return this.parser.range.getValues(null, null).slice(startAt, endAt + 1);
};
