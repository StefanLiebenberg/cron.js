goog.provide('tests.util.RangeParser');
goog.require('goog.testing.jsunit');
goog.require('sage.util.RangeParser');
goog.require('sage.util.StringParser');

var range_parser;
var parser_001;
var parser_002;
var parser_003;

function setUp() {
  range_parser = new sage.util.RangeParser(10, 20);
  parser_001 = new sage.util.StringParser(/foo1/);
  parser_002 = new sage.util.StringParser(/foo2/);
  parser_003 = new sage.util.StringParser(/foo3/);
}

function tearDown() {
  delete range_parser;
  delete parser_001;
  delete parser_002;
  delete parser_003;
}

function testConstructor() {
  assertTrue(range_parser instanceof sage.util.RangeParser);
//  assertTrue(range_parser instanceof sage.util.Parser);
}

function addParsers() {
  range_parser.parsers.push(parser_001);
  range_parser.parsers.push(parser_002);
  range_parser.parsers.push(parser_003);
}

function testParsing() {
  addParsers();

  var string_001 = 'abc foo1 cded';
  var string_002 = 'abc foo2 foo1 foo3 cded';
  var string_003 = 'abc foo3 cded';
  var string_004 = 'abc foo3 cded foo2';

  assertArrayEquals(['foo1'], range_parser.parse(string_001).slice() );
  assertArrayEquals(['foo1'], range_parser.parse(string_002).slice() );
  assertArrayEquals(['foo3'], range_parser.parse(string_003).slice() );
  assertArrayEquals(['foo2'], range_parser.parse(string_004).slice() );

}
