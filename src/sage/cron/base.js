goog.provide('sage.cron.Base');
goog.provide('sage.cron.Base.methods');
goog.require('sage.util.RangeParser');



/**
 * @constructor
 * @param {number} from start of range.
 * @param {number} to end of range.
 * @param {string} allowable_string allowable string.
 * @extends {sage.util.RangeParser}
 */
sage.cron.Base = function(from,to,allowable_string) {
  goog.base(this, from, to);

  this.allow = allowable_string;
  this.aliases = {};

  var reg_comma, reg_all, reg_single, reg_range, reg_increment;
  reg_comma = /\,/;
  reg_all = /\,/;
  reg_single = new RegExp('^' + this.allow + '$');
  reg_range = new RegExp('^' + this.allow + '-' + this.allow + '$');
  reg_increment = new RegExp('^[^\/]+\/' + this.allow + '$');

  this.parsers[0] = new Parser(reg_comma, Base.methods.comma);
  this.parsers[1] = new Parser(reg_all, Base.methods.all);
  this.parsers[2] = new Parser(reg_single, Base.methods.single);
  this.parsers[3] = new Parser(reg_range, Base.methods.range);
  this.parsers[4] = new Parser(reg_increment, Base.methods.increment);
};
goog.inherits(sage.cron.Base.prototype, sage.util.RangeParser);

sage.cron.Base.methods.all = function(spec, base ) {
  return base.range.slice();
};

sage.cron.Base.methods.comma = function(spec, base) {
  var parts = spec.split(',');
  var result = [];
  for (var i = 0; i < parts.length; i++) {
    result.push.apply(result, base.parse(parts[i]));
  }
  return result;
};

sage.cron.Base.methods.single = function(spec, base) {
  var at = parseInt(spec) - base.range.from;
  return base.range.slice(at, at + 1);
};

sage.cron.Base.methods.range = function(spec, base ) {
  var parts = spec.split('-');
  var startAt = parseInt(parts[0]) - base.range.from;
  var endAt = parseInt(parts[1]) - base.range.from;
  return base.range.slice(startAt, endAt + 1);
};


sage.cron.Base.methods.increment = function(spec, base ) {
  var parts = spec.split('/');
  var range = base.parse(parts[0]);
  var increment = parseInt(parts[1]);
  var result = [];
  for (var i = 0, l = range.length; i < l; i += increment) {
    result.push(range[i]);
  }
  return result;
};
