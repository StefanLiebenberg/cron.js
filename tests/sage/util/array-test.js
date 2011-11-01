goog.provide('tests.sage.util.array');
goog.require('goog.testing.jsunit');
goog.require('sage.util.array');


function testFoo() {
  // array with duplicates
  var array_001 = [1, 10, 1, 2, 2, 3, 3, 4, 5, 6, 4, 7, 8, 9, 10];

  // array without duplicates
  var array_002 = [1, 10, 2, 3, 4, 5, 6, 7, 8, 9];

  // array with duplicates removed.
  var array_003 = sage.util.array.uniq(array_001.slice());

  assertArrayEquals(array_002, array_003);
}
