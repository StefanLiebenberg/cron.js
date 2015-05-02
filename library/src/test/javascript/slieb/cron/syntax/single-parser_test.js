goog.provide('slieb.cron.syntax.SingleParserTest');
goog.require('goog.testing.jsunit');
goog.require('slieb.cron.syntax.SingleParser');
goog.require('slieb.cron.SpecParser');

goog.exportSymbol('testSingleParser', function () {
//  var minuteSpecParser = /** @type {slieb.cron.SpecParser} */
  slieb.cron.SpecSecondParser = new slieb.cron.SpecParser(0, 59, '[1-5]?[0-9]');
});

