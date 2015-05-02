goog.provide('sage.cron.syntax.AllParser');
goog.require('sage.cron.syntax.AbstractParser');



/**
 * @constructor
 * @extends { sage.cron.syntax.AbstractParser}
 * @param {sage.cron.SpecParser} parser the spec_parser.
 */
sage.cron.syntax.AllParser = function(parser) {
  sage.cron.syntax.AllParser.base(this, 'constructor', parser, /^\*$/);

};
goog.inherits(sage.cron.syntax.AllParser, sage.cron.syntax.AbstractParser);


/** @override */
sage.cron.syntax.AllParser.prototype.parse = function(spec) {
  return this.parser.range.getValues(null, null);
};
