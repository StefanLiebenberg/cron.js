goog.provide('sage.cron.syntax.IncrementParser');
goog.require('sage.util.StringParser');



/**
 * @constructor
 * @extends {sage.util.StringParser}
 * @param {string} allow Allowable string in parser.
 */
sage.cron.syntax.IncrementParser = function(allow) {
  var regexp = new RegExp('^[^\/]+\/' + allow + '$');
  goog.base(this, regexp);
};
goog.inherits(sage.cron.syntax.IncrementParser, sage.util.StringParser);


/**
 * @param {string} spec the specification string.
 * @param {sage.cron.SpecParser} parser the spec_parser.
 * @return {Array.<number>} return an array of numbers.
 */
sage.cron.syntax.IncrementParser.prototype.parseInternal =
    function(spec, parser) {

  var parts = /** @type {Array.<string>} */ spec.split('/');
  var range = /** @type {Array.<number>} */parser.parse(parts[0]);
  var increment = /** @type {number} */ parseInt(parts[1]);
  /** @type {Array.<number>} */
  var result = [];
  for (var i = 0, l = range.length; i < l; i += increment) {
    result.push(range[i]);
  }
  return result;
};

