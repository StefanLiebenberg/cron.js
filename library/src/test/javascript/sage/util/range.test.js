goog.provide('tests.sage.util.Range');
goog.require('goog.testing.jsunit');
goog.require('sage.util.Range');

var range;

function setUp() {
  range = new sage.util.Range(50, 99);
}

function tearDown() {
  delete range;
}

function testConstructor() {
  assertTrue(range instanceof sage.util.Range);
  assertEquals(range.from, 50);
  assertEquals(range.to, 99);
}

function testLength() {
  assertEquals(50, range.length);
}

function testValueAt() {
  var expected, actual;
  for (var i = 0; i < 100; i++) {
    expected = i < 50 ? i + 50 : undefined;
    actual = range.valueAt(i);
    assertEquals(expected, actual);
  }
}

function testIndexOf() {

  var expected, actual;

  for (var i = 0; i < 100; i++) {
    expected = i < 50 ? -1 : i - 50;
    actual = range.indexOf(i);
    assertEquals(expected, actual);
  }
}

function testGetValues() {
  assertArrayEquals([60, 61, 62, 63, 64], range.getValues(60, 64));
}
