goog.provide('tests.sage.cron.syntax.AllParser');
goog.require('goog.testing.jsunit');
goog.require('sage.cron.syntax.AllParser');

var all_parser;

function setUp() {
  all_parser = new sage.cron.syntax.AllParser();
}

function tearDown() {
  delete all_parser;
}

function testConstructor() {
  assertTrue(all_parser instanceof sage.cron.syntax.AllParser);
}

function testAllParser() {}
