goog.provide('tests.slieb.cron.syntax.AllParser');
goog.require('goog.testing.jsunit');
goog.require('slieb.cron.syntax.AllParser');

var all_parser;

goog.exportSymbol("setUp", function setUp() {
    all_parser = new slieb.cron.syntax.AllParser();
});

goog.exportSymbol("tearDown", function () {
    delete all_parser;
});

function testConstructor() {
    assertTrue(all_parser instanceof slieb.cron.syntax.AllParser);
}

function testAllParser() {
}
