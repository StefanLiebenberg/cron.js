goog.provide('sage.cron.syntax.AliasParser');
goog.require('sage.util.StringParser');



/**
 * @constructor
 * @extends {sage.util.StringParser}
 * @param {string} allow Allowable string in parser.
 */
sage.cron.syntax.AliasParser = function(allow) {
  var regexp = /([a-z][a-z][a-z])|([A-Z][A-Z][A-Z])/g;
  goog.base(this, regexp);
  /** @type {Object.<number>} */
  this.aliases = {};
};
goog.inherits(sage.cron.syntax.AliasParser, sage.util.StringParser);


/**
 * @override {sage.util.StringParser.prototype.parse}
 * @param {string} spec the specification string.
 * @param {sage.cron.SpecParser} parser the spec_parser.
 * @return {Array.<number>} return an array of numbers.
 */
sage.cron.AliasSpecParser.prototype.parse;


/**
 * @param {string} spec the specification string.
 * @param {sage.cron.SpecParser} parser the spec_parser.
 * @return {Array.<number>} return an array of numbers.
 */
sage.cron.syntax.AliasParser.prototype.parseInternal = function(spec, parser) {
  spec = spec.replace(this.regex, function(string) {
    string = string.toLowerCase();
    if (string in parser.aliases) {
      string = parser.aliases[string];
    }
    return string;
  });
  return parser.parse(spec);
};
