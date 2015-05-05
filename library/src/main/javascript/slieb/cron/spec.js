goog.provide('slieb.cron.Spec');
goog.require('slieb.cron.SpecDayParser');
goog.require('slieb.cron.SpecHourParser');
goog.require('slieb.cron.SpecMinuteParser');
goog.require('slieb.cron.SpecMonthParser');
goog.require('slieb.cron.SpecSecondParser');
goog.require('slieb.cron.SpecWeekdayParser');
goog.require('slieb.util.date');
goog.require('goog.string');


/**
 * @constructor
 * @param {string} spec a string spec.
 */
slieb.cron.Spec = function (spec) {
    spec = goog.string.trim(spec);

    if (spec in slieb.cron.Spec.aliases_) {
        spec = slieb.cron.Spec.aliases_[spec];
    }

    /** @type {string} */
    this.spec = spec;

    var parts = /** @type {Array.<string>} */ (spec.split(' '));

    if (parts.length !== 6) {
        /** @type {string} */
        var errorString;
        errorString = 'CronSpec only accepts specifications with 6 parts:';
        errorString += spec;
        errorString += ' is invalid';
        throw new Error(errorString);
    }

    /** @type {Array.<number>} */
    this.seconds = slieb.cron.SpecSecondParser.parse(parts[0]);
    /** @type {Array.<number>} */
    this.minutes = slieb.cron.SpecMinuteParser.parse(parts[1]);
    /** @type {Array.<number>} */
    this.hours = slieb.cron.SpecHourParser.parse(parts[2]);
    /** @type {Array.<number>} */
    this.days = slieb.cron.SpecDayParser.parse(parts[3]);
    /** @type {Array.<number>} */
    this.months = slieb.cron.SpecMonthParser.parse(parts[4]);
    /** @type {Array.<number>} */
    this.weekdays = slieb.cron.SpecWeekdayParser.parse(parts[5]);
};


/**
 * @param {Date} date the current date.
 * @return {Date} the next date.
 */
slieb.cron.Spec.prototype.next = function (date) {
    /** @type {Date} */
    var next = new Date();
    next.setTime(date.getTime());
    slieb.util.date.addSeconds(next, 1);
    next.setMilliseconds(0);

    var len_seconds = this.seconds.length;
    var do_seconds = len_seconds && len_seconds !== 60;

    var len_minutes = this.minutes.length;
    var do_minutes = len_minutes && len_minutes !== 60;

    var len_hours = this.hours.length;
    var do_hours = len_hours && len_hours !== 24;

    var len_weekdays = this.weekdays.length;
    var do_weekdays = len_weekdays && len_weekdays !== 7;

    var len_days = this.days.length;
    var do_days = len_days && len_days !== 31;

    var len_months = this.months.length;
    var do_months = len_months && len_months !== 12;

    var done = false, count, flag;
    while (!done) {
        count = next.getSeconds();
        if (do_seconds && this.seconds.indexOf(count) === -1) {
            flag = true;
            for (var i = 0; i < len_seconds; i++) {
                if (this.seconds[i] >= count) {
                    next.setSeconds(this.seconds[i]);
                    flag = false;
                    break;
                }
            }
            if (flag) {
                next.setSeconds(0);
                slieb.util.date.addMinutes(next, 1);
            }
            continue;
        }

        count = next.getMinutes();
        if (do_minutes && this.minutes.indexOf(count) == -1) {
            flag = true;
            for (var i = 0; i < len_minutes; i++) {
                if (this.minutes[i] >= count) {
                    next.setMinutes(this.minutes[i]);
                    flag = false;
                    break;
                }
            }
            if (flag) {
                next.setMinutes(0);
                slieb.util.date.addHours(next, 1);
            }
            continue;
        }

        count = next.getHours();
        if (do_hours && this.hours.indexOf(count) == -1) {
            flag = true;
            for (var i = 0; i < len_hours; i++) {
                if (this.hours[i] >= count) {
                    next.setHours(this.hours[i]);
                    flag = false;
                    break;
                }
            }
            next.setMilliseconds(0);
            next.setSeconds(0);
            next.setMinutes(0);
            if (flag) {
                slieb.util.date.addDays(next, 1);
                next.setHours(0);
                continue;
            }
        }

        count = next.getDay() + 1;
        if (do_weekdays && this.weekdays.indexOf(count) == -1) {
            flag = true;
            for (var i = 0; i < len_weekdays; i++) {
                if (this.weekdays[i] >= count) {
                    var delta = this.weekdays[i] - count;
                    slieb.util.date.addDays(next, delta - 1);
                    flag = false;
                    break;
                }
            }
            if (flag) {
                slieb.util.date.addDays(next, 8 - count);
                next.setSeconds(0);
                next.setMinutes(0);
                next.setHours(0);
                continue;
            }
        }

        count = next.getDate();
        if (do_days && this.days.indexOf(count) == -1) {
            flag = true;
            for (var i = 0; i < len_days; i++) {
                if (this.days[i] >= count) {
                    while (next.getDate() != this.days[i])
                        next.setDate(this.days[i]);
                    flag = false;
                    break;
                }
            }
            next.setSeconds(0);
            next.setHours(0);
            next.setMinutes(0);
            if (flag) {
                next.setDate(1);
                slieb.util.date.addMonths(next, 1);
            }
            continue;
        }

        count = next.getMonth() + 1;
        if (do_months && this.months.indexOf(count) == -1) {
            flag = true;
            for (var i = 0; i < len_months; i++) {
                if (this.months[i] >= count) {
                    next.setMonth(this.months[i] - 1);
                    flag = false;
                    break;
                }
            }
            next.setSeconds(0);
            next.setMinutes(0);
            next.setHours(0);
            next.setDate(1);
            if (flag) {
                next.setMonth(0);
                slieb.util.date.addYears(next, 1);
            }
            continue;
        }
        done = true;
    }

    return next;
};


/**
 * @type {Object.<string>}
 * @const
 * @private
 */
slieb.cron.Spec.aliases_ = {
    '@second': '* * * * * *',   //on every second
    '@minute': '0 * * * * *',   //at x:00 for every minute x
    '@halfminute': '0,30 * * * * *',//at x:00 and x:30 for every minute x
    '@hour': '0 0 * * * *',   //at x:00:00 for every hour x
    '@halfhour': '0 0,30 * * *',  //at x:00:00 and x:30:00 for every hour x
    '@daily': '0 0 0 * * *',   //at midnight of every day
    '@monthly': '0 0 0 1 * *',   //at the first of every month, 00:00:00
    '@yearly': '0 0 0 1 1 *',   //at 1Jan 00:00:00 every year
    '@weekly': '0 0 0 * * 1',   //on sunday 00:00:00 every week
    '@weekday': '0 0 0 * * 2-6'  //midnight on every weekday
};


/**
 * @param {Date} date object.
 * @param {slieb.cron.Spec} cronspec the cron interval specification.
 * @return {Date} returns next date.
 */
slieb.cron.Spec.next = function (date, cronspec) {
    return cronspec.next(date);
};


/**
 * @param {string} string a interval string to be parsed.
 * @return {slieb.cron.Spec} returns a spec.
 */
slieb.cron.Spec.parse = function (string) {
    return new slieb.cron.Spec(string);
};
