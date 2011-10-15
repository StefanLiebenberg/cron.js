goog.provide('sage.util.date');
goog.require('sage.util.array');


/**
 * @param {Date} date the Date object to modify.
 * @param {number} time the amount of milleseconds to add to date.
 * @return {Date} returns the modified date instance.
 */
sage.util.date.addTime = function(date, time) {
  var current = date.getTime();
  date.setTime(current + time);
  return date;
};


/**
 * @param {Date} date the Date object to modify.
 * @param {number} seconds the amount of milleseconds to add to date.
 * @return {Date} returns the modified date instance.
 */
sage.util.date.addSeconds = function(date, seconds) {
  var current = date.getSeconds();
  date.setSeconds(current + seconds);
  return date;
};


/**
 * @param {Date} date the Date object to modify.
 * @param {number} minutes the amount of milleseconds to add to date.
 * @return {Date} returns the modified date instance.
 */
sage.util.date.addMinutes = function(date, minutes) {
  var current = date.getMinutes();
  date.setMinutes(current + minutes);
  return date;
};


/**
 * @param {Date} date the date object to modify.
 * @param {number} hours the amount of milleseconds to add to date.
 * @return {Date} returns the modified date instance.
 */
sage.util.date.addHours = function(date, hours) {
  /** @type {number} */
  var current = date.getHours();
  date.setHours(current + hours);
  return date;
};


/**
 * @param {Date} date the date object to modify.
 * @param {number} days the amount of milleseconds to add to date.
 * @return {Date} returns the modified date instance.
 */
sage.util.date.addDays = function(date, days) {
  var current = date.getDate();
  date.setDate(current + days);
  return date;
};


/**
 * @param {Date} date the date object to modify.
 * @param {number} months the amount of milleseconds to add to date.
 * @return {Date} returns the modified date instance.
 */
sage.util.date.addMonths = function(date, months) {
  var current = date.getMonth();
  date.setMonth(current + months);
  return date;
};


/**
 * @param {Date} date the date object to modify.
 * @param {number} years the amount of milleseconds to add to date.
 * @return {Date} returns the modified date instance.
 */
sage.util.date.addYears = function(date, years) {
  var current = date.getFullYear();
  date.setFullYear(current + years);
  return date;
};
