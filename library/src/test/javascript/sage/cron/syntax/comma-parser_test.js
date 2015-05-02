goog.provide('tests.slieb.cron.syntax.CommaParser');
goog.require('goog.testing.jsunit');
goog.require('slieb.cron.syntax.CommaParser');

var comma_parser;
function setUp() {
  comma_parser = new slieb.cron.syntax.CommaParser();
}

function tearDown() {
  delete comma_parser;
}


function testConstructor() {
  assertTrue(comma_parser instanceof slieb.cron.syntax.CommaParser);
}


