goog.provide('sage.cron.DayParser');
goog.provide('sage.cron.HourParser');
goog.provide('sage.cron.MinuteParser');
goog.provide('sage.cron.MonthParser');
goog.provide('sage.cron.SecondParser');
goog.provide('sage.cron.WeekdayParser');
goog.require('sage.cron.Base');
goog.require('sage.util.Parser');


/** @type {sage.cron.Base} */
sage.cron.SecondParser =
    new sage.cron.Base(0, 59, '[1-5]?[0-9]');


/** @type {sage.cron.Base} */
sage.cron.MinuteParser =
    new sage.cron.Base(0, 59, '[1-5]?[0-9]');


/** @type {sage.cron.Base} */
sage.cron.HourParser =
    new sage.cron.Base(0, 23, '(([0-1]?[0-9])|([2][0-3]))');


/** @type {sage.cron.Base} */
sage.cron.DayParser =
    new sage.cron.Base(1, 31, '(([0]?[1-9])|([1-2][0-9])|([3][0-1]))');


/** @type {sage.cron.Base} */
sage.cron.MonthParser =
    new sage.cron.Base(1, 12, '(([0]?[1-9])|([1][0-2]))');


/** @type {Object} */
sage.cron.MonthParser.aliases = {
  'jan': 1,
  'feb': 2,
  'mar': 3,
  'apr': 4,
  'may': 5,
  'jun': 6,
  'jul': 7,
  'aug': 8,
  'sep': 9,
  'oct': 10,
  'nov': 11,
  'dec': 12
};


/** @type {sage.cron.Base} */
sage.cron.WeekdayParser =
    new sage.cron.Base(1, 7, '([0]?[1-7])');


/** @type {Object} */
sage.cron.WeekParser.aliases = {
  'sun': 1,
  'mon': 2,
  'tue': 3,
  'wed': 4,
  'thu': 5,
  'fri': 6,
  'sat': 7
};


// Adding the alias Parser.
void (function() {

  var alias_regexp = /([a-z][a-z][a-z])|([A-Z][A-Z][A-Z])/g;

  /** @private */
  var alias_parser = new Parser(alias_regexp, function(spec, base) {
    spec = spec.replace(this.matcher, function(string) {
      string = string.toLowerCase();
      if (string in base.aliases) {
        string = base.aliases[string];
      }
      return string;
    });
    return base.parse(spec);
  });

  sage.cron.MonthParser.parser.push(alias_parser);
  sage.cron.WeekdayParser.parsers.push(alias_parser);

})();
