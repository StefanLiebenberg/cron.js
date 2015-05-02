goog.provide('slieb.cron.syntax.AllParser');
goog.require('slieb.cron.syntax.AbstractParser');



/**
 * @constructor
 * @extends { slieb.cron.syntax.AbstractParser}
 * @param {slieb.cron.SpecParser} parser the spec_parser.
 */
slieb.cron.syntax.AllParser = function(parser) {
  slieb.cron.syntax.AllParser.base(this, 'constructor', parser, /^\*$/);

};
goog.inherits(slieb.cron.syntax.AllParser, slieb.cron.syntax.AbstractParser);


/** @override */
slieb.cron.syntax.AllParser.prototype.parse = function(spec) {
  return this.parser.range.getValues(null, null);
};
