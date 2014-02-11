goog.provide('sage.cron.AliasSpecParser.Test');
goog.provide('sage.cron.SpecParser.Test');
goog.require('goog.testing.jsunit');
goog.require('sage.cron.AliasSpecParser');
goog.require('sage.cron.SpecParser');


function testsAliasSpecParser() {
  var parser = new sage.cron.AliasSpecParser(1, 7, '([0]?[1-7])', {'sun' : 1, 'mon': 2, 'wed' : 4, 'fri': 5});
  assertArrayEquals(parser.parse("mon"), [2]);
  assertArrayEquals(parser.parse("sun"), [1]);
  assertArrayEquals(parser.parse("tue"), []);
  assertArrayEquals(parser.parse("mon-wed"), [2,3,4]);
  assertArrayEquals(parser.parse("mon,fri"), [2,5]);
};

function testSpecParser() {
  var parser = new sage.cron.SpecParser(1, 7, '([0]?[1-7])');
  assertArrayEquals(parser.parse("2"), [2]);
  assertArrayEquals(parser.parse("1"), [1]);
  assertArrayEquals(parser.parse("0"), []);
  assertArrayEquals(parser.parse("2-4"), [2,3,4]);
  assertArrayEquals(parser.parse("2,5"), [2,5]);
};
