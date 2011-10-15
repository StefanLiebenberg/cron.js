goog.provide('sage.cron.AliasSpecParser');
goog.provide('sage.cron.SpecParser');

goog.require('sage.cron.syntax.AliasParser');
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

  this.parsers[0] = new sage.cron.syntax.CommaParser();
  this.parsers[1] = new sage.cron.syntax.AllParser();
  this.parsers[2] = new sage.cron.syntax.SingleParser(this.allow);
  this.parsers[3] = new sage.cron.syntax.RangeParser(this.allow);
  this.parsers[4] = new sage.cron.syntax.IncrementParser(this.allow);
};
goog.inherits(sage.cron.SpecParser, sage.util.RangeParser);


/**
 * @override {sage.util.RangeParser.prototype.parse}
 * @param {string} spec the specification string.
 * @return {Array} returns an array.
 */
sage.cron.SpecParser.prototype.parse;



/**
 * @constructor
 * @extends {sage.cron.SpecParser}
 * @param {number} from start of range.
 * @param {number} to end of range.
 * @param {string} allowable_string allowable string.
 */
sage.cron.AliasSpecParser = function(from, to, allowable_string) {
  goog.base(this, from, to, allowable_string);
  this.parsers[5] = new sage.cron.syntax.AliasParser(this.allow);
};
goog.inherits(sage.cron.AliasSpecParser, sage.cron.SpecParser);
