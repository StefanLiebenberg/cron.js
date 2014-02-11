goog.provide('sage.cron.AliasSpecParser');
goog.provide('sage.cron.SpecParser');

goog.require('goog.structs.Map');
goog.require('sage.cron.syntax.AllParser');
goog.require('sage.cron.syntax.CommaParser');
goog.require('sage.cron.syntax.IncrementParser');
goog.require('sage.cron.syntax.RangeParser');
goog.require('sage.cron.syntax.SingleParser');
goog.require('sage.util.RangeParser');



/**
 * @constructor
 * @param {number} from start of range.
 * @param {number} to end of range.
 * @param {string} allowable_string allowable string.
 * @extends {sage.util.RangeParser}
 */
sage.cron.SpecParser = function(from, to, allowable_string) {
  goog.base(this, from, to);

  /** @type {string} */
  this.allow = allowable_string;

  this.parsers[0] = new sage.cron.syntax.CommaParser(this);
  this.parsers[1] = new sage.cron.syntax.AllParser(this);
  this.parsers[2] = new sage.cron.syntax.SingleParser(this);
  this.parsers[3] = new sage.cron.syntax.RangeParser(this);
  this.parsers[4] = new sage.cron.syntax.IncrementParser(this);
};
goog.inherits(sage.cron.SpecParser, sage.util.RangeParser);



/**
 * @constructor
 * @extends {sage.cron.SpecParser}
 * @param {number} from start of range.
 * @param {number} to end of range.
 * @param {string} allowable_string allowable string.
 * @param {Object.<number>} aliases
 */
sage.cron.AliasSpecParser = function(from, to, allowable_string, aliases) {
  goog.base(this, from, to, allowable_string);
  this.aliasMap = new goog.structs.Map(aliases);
  var keys = this.aliasMap.getKeys();
  this.aliasRegEx = new RegExp('(' + keys.join('|') + ')', 'g');
};
goog.inherits(sage.cron.AliasSpecParser, sage.cron.SpecParser);


/**
 * @type {goog.structs.Map}
 */
sage.cron.AliasSpecParser.prototype.aliasMap;


/**
 * @type {RegExp}
 */
sage.cron.AliasSpecParser.prototype.aliasRegEx;


/**
 * @param {string} spec
 * @return {string}
 */
sage.cron.AliasSpecParser.prototype.resolveAliases = function(spec) {
  var aliasMap = this.aliasMap;
  return spec.replace(this.aliasRegEx, function(alias) {
    return aliasMap.get(alias, alias);
  });
};


/**
 * @override
 */
sage.cron.AliasSpecParser.prototype.parse = function(spec) {
  return goog.base(this, 'parse', this.resolveAliases(spec));
};
