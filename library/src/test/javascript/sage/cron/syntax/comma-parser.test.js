goog.provide('tests.sage.cron.syntax.CommaParser');
goog.require('goog.testing.jsunit');
goog.require('sage.cron.syntax.CommaParser');

var comma_parser;
function setUp() {
  comma_parser = new sage.cron.syntax.CommaParser();
}

function tearDown() {
  delete comma_parser;
}


function testConstructor() {
  assertTrue(comma_parser instanceof sage.cron.syntax.CommaParser);
}


