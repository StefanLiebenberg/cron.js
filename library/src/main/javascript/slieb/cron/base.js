goog.provide('slieb.cron.AliasSpecParser');
goog.provide('slieb.cron.SpecParser');

goog.require('goog.structs.Map');
goog.require('slieb.cron.syntax.AllParser');
goog.require('slieb.cron.syntax.CommaParser');
goog.require('slieb.cron.syntax.IncrementParser');
goog.require('slieb.cron.syntax.RangeParser');
goog.require('slieb.cron.syntax.SingleParser');
goog.require('slieb.util.RangeParser');


/**
 * @constructor
 * @param {number} from start of range.
 * @param {number} to end of range.
 * @param {string} allowable_string allowable string.
 * @extends {slieb.util.RangeParser}
 */
slieb.cron.SpecParser = function (from, to, allowable_string) {
    slieb.cron.SpecParser.base(this, 'constructor', from, to);

    /** @type {string} */
    this.allow = allowable_string;

    this.parsers[0] = new slieb.cron.syntax.CommaParser(this);
    this.parsers[1] = new slieb.cron.syntax.AllParser(this);
    this.parsers[2] = new slieb.cron.syntax.SingleParser(this);
    this.parsers[3] = new slieb.cron.syntax.RangeParser(this);
    this.parsers[4] = new slieb.cron.syntax.IncrementParser(this);
};
goog.inherits(slieb.cron.SpecParser, slieb.util.RangeParser);


/**
 * @constructor
 * @extends {slieb.cron.SpecParser}
 * @param {number} from start of range.
 * @param {number} to end of range.
 * @param {string} allowable_string allowable string.
 * @param {Object.<number>} aliases
 */
slieb.cron.AliasSpecParser = function (from, to, allowable_string, aliases) {
    slieb.cron.AliasSpecParser.base(this, 'constructor', from, to, allowable_string);
    this.aliasMap = new goog.structs.Map(aliases);
    var keys = this.aliasMap.getKeys();
    this.aliasRegEx = new RegExp('(' + keys.join('|') + ')', 'g');
};
goog.inherits(slieb.cron.AliasSpecParser, slieb.cron.SpecParser);


/**
 * @type {goog.structs.Map}
 */
slieb.cron.AliasSpecParser.prototype.aliasMap;


/**
 * @type {RegExp}
 */
slieb.cron.AliasSpecParser.prototype.aliasRegEx;


/**
 * @param {string} spec
 * @return {string}
 */
slieb.cron.AliasSpecParser.prototype.resolveAliases = function (spec) {
    var aliasMap = this.aliasMap;
    return spec.replace(this.aliasRegEx, function (alias) {
        return aliasMap.get(alias, alias);
    });
};


/**
 * @override
 */
slieb.cron.AliasSpecParser.prototype.parse = function (spec) {
    return slieb.cron.AliasSpecParser.base(this, 'parse', this.resolveAliases(spec));
};
