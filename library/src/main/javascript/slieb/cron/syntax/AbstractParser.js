goog.provide('slieb.cron.syntax.AbstractParser');



/**
 * @constructor
 * @param {slieb.cron.SpecParser} parser
 * @param {RegExp} regex the parser regex.
 */
slieb.cron.syntax.AbstractParser = function(parser, regex) {
  this.parser = parser;
  this.regex = regex;
};


/** @type {slieb.cron.SpecParser} */
slieb.cron.syntax.AbstractParser.prototype.parser;


/** @type {RegExp} */
slieb.cron.syntax.AbstractParser.prototype.regex;


/**
 * A string to test if this parser should parse the string.
 * @param {!string} string a string.
 * @return {boolean} returns the result;.
 */
slieb.cron.syntax.AbstractParser.prototype.test = function(string) {
  this.regex.lastIndex = 0;
  return this.regex.test(string);
};


/**
 * @param {!string} string
 * @return {!Array.<number>}
 */
slieb.cron.syntax.AbstractParser.prototype.parse = goog.abstractMethod;
