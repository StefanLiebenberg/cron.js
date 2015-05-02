goog.provide('sage.cron.syntax.SingleParserTest');
goog.require('goog.testing.jsunit');
goog.require('sage.cron.syntax.SingleParser');
goog.require('sage.cron.SpecParser');

goog.exportSymbol('testSingleParser', function () {
//  var minuteSpecParser = /** @type {sage.cron.SpecParser} */
  sage.cron.SpecSecondParser = new sage.cron.SpecParser(0, 59, '[1-5]?[0-9]');
});

