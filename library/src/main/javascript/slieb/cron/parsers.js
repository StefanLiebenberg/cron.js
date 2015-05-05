goog.provide('slieb.cron.SpecDayParser');
goog.provide('slieb.cron.SpecHourParser');
goog.provide('slieb.cron.SpecMinuteParser');
goog.provide('slieb.cron.SpecMonthParser');
goog.provide('slieb.cron.SpecSecondParser');
goog.provide('slieb.cron.SpecWeekdayParser');
goog.require('slieb.cron.SpecParser');


/** @type {slieb.cron.SpecParser} */
slieb.cron.SpecSecondParser =
    new slieb.cron.SpecParser(0, 59, '[1-5]?[0-9]');


/** @type {slieb.cron.SpecParser} */
slieb.cron.SpecMinuteParser =
    new slieb.cron.SpecParser(0, 59, '[1-5]?[0-9]');


/** @type {slieb.cron.SpecParser} */
slieb.cron.SpecHourParser =
    new slieb.cron.SpecParser(0, 23, '(([0-1]?[0-9])|([2][0-3]))');


/** @type {slieb.cron.SpecParser} */
slieb.cron.SpecDayParser =
    new slieb.cron.SpecParser(1, 31, '(([0]?[1-9])|([1-2][0-9])|([3][0-1]))');


/** @type {slieb.cron.SpecParser} */
slieb.cron.SpecMonthParser =
    new slieb.cron.AliasSpecParser(1, 12, '(([0]?[1-9])|([1][0-2]))', {
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


/** @type {slieb.cron.SpecParser} */
slieb.cron.SpecWeekdayParser =
    new slieb.cron.AliasSpecParser(1, 7, '([0]?[1-7])', {
        'sun': 1,
        'mon': 2,
        'tue': 3,
        'wed': 4,
        'thu': 5,
        'fri': 6,
        'sat': 7
    });
