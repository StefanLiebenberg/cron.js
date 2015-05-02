goog.provide('sage.cron.syntax.AbstractParser');



/**
 * @constructor
 * @param {sage.cron.SpecParser} parser
 * @param {RegExp} regex the parser regex.
 */
sage.cron.syntax.AbstractParser = function(parser, regex) {
  this.parser = parser;
  this.regex = regex;
};


/** @type {sage.cron.SpecParser} */
sage.cron.syntax.AbstractParser.prototype.parser;


/** @type {RegExp} */
sage.cron.syntax.AbstractParser.prototype.regex;


/**
 * A string to test if this parser should parse the string.
 * @param {!string} string a string.
 * @return {boolean} returns the result;.
 */
sage.cron.syntax.AbstractParser.prototype.test = function(string) {
  this.regex.lastIndex = 0;
  return this.regex.test(string);
};


/**
 * @param {!string} string
 * @return {!Array.<number>}
 */
sage.cron.syntax.AbstractParser.prototype.parse = goog.abstractMethod;
