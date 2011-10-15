goog.provide('sage.util.Parser');
goog.provide('sage.util.StringParser');



/**
 * @constructor
 */
sage.util.Parser = function() {};


/**
 * @param {*} item item to parse.
 * @return {*} returns the parsed content.
 */
sage.util.Parser.prototype.parse = function(item) {
  return this.parseInternal.apply(this, arguments);
};


/**
 * @param {*} item item to parse.
 * @return {*} returns the parsed content.
 */
sage.util.Parser.prototype.parseInternal = function(item) {
  return item;
};



/**
 * @constructor
 * @param {RegExp} regex the parser regex.
 * @extends {sage.util.Parser}
 */
sage.util.StringParser = function(regex) {
  goog.base(this);
  /** @type {RegExp} */
  this.regex = regex;
};
goog.inherits(sage.util.StringParser, sage.util.Parser);


/**
 * A string to test if this parser should parse the string.
 * @param {!string} string a string.
 * @return {boolean} returns the result;.
 */
sage.util.StringParser.prototype.test = function(string) {
  this.regex.lastIndex = 0;
  return this.regex.test(string);
};


/**
 * @param {!string} string a string.
 * @return {Array.<string>} returns what e parser can extact from the string.
 */
sage.util.StringParser.prototype.parseInternal = function(string) {
  if (this.test(string)) {
    this.regex.lastIndex = 0;
    return string.match(this.regex);
  }
};
