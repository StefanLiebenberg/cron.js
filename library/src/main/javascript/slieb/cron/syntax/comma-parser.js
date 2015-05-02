goog.provide('slieb.cron.syntax.CommaParser');
goog.require('slieb.cron.syntax.AbstractParser');


/**
 * @constructor
 * @extends { slieb.cron.syntax.AbstractParser}
 * @param {slieb.cron.SpecParser} parser
 */
slieb.cron.syntax.CommaParser = function (parser) {
    slieb.cron.syntax.CommaParser.base(this, 'constructor', parser, /\,/);

};
goog.inherits(slieb.cron.syntax.CommaParser, slieb.cron.syntax.AbstractParser);


/** @override */
slieb.cron.syntax.CommaParser.prototype.parse = function (spec) {

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
