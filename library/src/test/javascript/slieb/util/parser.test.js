goog.provide('tests.slieb.util.Parser');
goog.require('goog.testing.jsunit');
goog.require('slieb.util.StringParser');

var parser, string_parser, parser_regexp;

function setUp() {
//  parser = new slieb.util.Parser();
  string_parser = new slieb.util.StringParser(parser_regexp);
  parser_regexp = /foo/g;
}

function tearDown() {
//  delete parser;
  delete string_parser;
  delete parser_regexp;
}

function testParserConstructor() {
//  assertTrue('Instance must be non-null and have the expected class',
//      parser instanceof slieb.util.Parser);
}

function testParserParsing() {
//  var object, result;
//  object = new Object();
//  result = parser.parse(object);
//  assertEquals(object, result);
}

function testStringParserConstructor() {
//  assertTrue('Instance must be non-null and have the expected class',
//      string_parser instanceof slieb.util.Parser);
  assertTrue('Instance must be non-null and have the expected class',
      string_parser instanceof slieb.util.StringParser);
}

function testStringParserTesting() {
  var a, b, c, d;
  a = 'foo';
  b = 'notanything';
  c = 'some_foo';
  d = 'regular';

  assertTrue('StringParser Must accept some strings and reject others',
      string_parser.test(a));
  assertTrue('StringParser Must accept some strings and reject others',
      string_parser.test(c));

  assertFalse('StringParser Must accept some strings and reject others',
      string_parser.test(b));
  assertFalse('StringParser Must accept some strings and reject others',
      string_parser.test(d));

}

function testStringParserParsing() {
  var a, b;
  a = 'foo';
  b = 'foo_foo';
  c = 'abc';

  assertArrayEquals(['foo'], string_parser.parse(a).slice());
  assertArrayEquals(['foo', 'foo'], string_parser.parse(b).slice());
  assertArrayEquals([], string_parser.parse(c).slice());
}
