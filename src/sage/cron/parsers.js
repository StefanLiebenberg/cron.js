goog.provide('sage.cron.SpecDayParser');
goog.provide('sage.cron.SpecHourParser');
goog.provide('sage.cron.SpecMinuteParser');
goog.provide('sage.cron.SpecMonthParser');
goog.provide('sage.cron.SpecSecondParser');
goog.provide('sage.cron.SpecWeekdayParser');
goog.require('sage.cron.SpecParser');


/** @type {sage.cron.SpecParser} */
sage.cron.SpecSecondParser =
    new sage.cron.SpecParser(0, 59, '[1-5]?[0-9]');


/** @type {sage.cron.SpecParser} */
sage.cron.SpecMinuteParser =
    new sage.cron.SpecParser(0, 59, '[1-5]?[0-9]');


/** @type {sage.cron.SpecParser} */
sage.cron.SpecHourParser =
    new sage.cron.SpecParser(0, 23, '(([0-1]?[0-9])|([2][0-3]))');


/** @type {sage.cron.SpecParser} */
sage.cron.SpecDayParser =
    new sage.cron.SpecParser(1, 31, '(([0]?[1-9])|([1-2][0-9])|([3][0-1]))');


/** @type {sage.cron.SpecParser} */
sage.cron.SpecMonthParser =
    new sage.cron.AliasSpecParser(1, 12, '(([0]?[1-9])|([1][0-2]))', {
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
    });


/** @type {sage.cron.SpecParser} */
sage.cron.SpecWeekdayParser =
    new sage.cron.AliasSpecParser(1, 7, '([0]?[1-7])', {
      'sun': 1,
      'mon': 2,
      'tue': 3,
      'wed': 4,
      'thu': 5,
      'fri': 6,
      'sat': 7
    });
