goog.provide('slieb.util.StringParser');



/**
 * @constructor
 * @param {RegExp} regex the parser regex.
 */
slieb.util.StringParser = function(regex) {
  /** @type {RegExp} */
  this.regex = regex;
};


/**
 * A string to test if this parser should parse the string.
 * @param {!string} string a string.
 * @return {boolean} returns the result;.
 */
slieb.util.StringParser.prototype.test = function(string) {
  this.regex.lastIndex = 0;
  return this.regex.test(string);
};


/**
 * @param {string} string a string.
 * @return {Array.<number>} returns what e parser can extact from the string.
 */
slieb.util.StringParser.prototype.parse = function(string) {
  if (this.test(string)) {
    this.regex.lastIndex = 0;
    return string.match(this.regex);
  }
  return [];
};
