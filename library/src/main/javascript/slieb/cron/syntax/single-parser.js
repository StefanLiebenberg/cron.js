goog.provide('slieb.cron.syntax.SingleParser');
goog.require('slieb.cron.syntax.AbstractParser');


/**
 * @constructor
 * @extends {slieb.cron.syntax.AbstractParser}
 * @param {slieb.cron.SpecParser} parser
 */
slieb.cron.syntax.SingleParser = function (parser) {
    slieb.cron.syntax.SingleParser.base(this, 'constructor', parser, new RegExp('^' + parser.allow + '$'));
};
goog.inherits(slieb.cron.syntax.SingleParser, slieb.cron.syntax.AbstractParser);


/** @override */
slieb.cron.syntax.SingleParser.prototype.parse = function (spec) {
    var range = this.parser.range;
    var at = parseInt(spec, 10) - range.from;
    return [range.valueAt(at)];
};
