goog.provide('tests.sage.cron.Spec');
goog.require('goog.testing.jsunit');
goog.require('sage.cron.Spec');
goog.require('sage.util.Range');


function assertSpecArraysEquals(specA, specB) {
  assertTrue(specA instanceof sage.cron.Spec);
  assertTrue(specB instanceof sage.cron.Spec);

  assertArrayEquals(specA.seconds, specB.seconds);
  assertArrayEquals(specA.minutes, specB.minutes);
  assertArrayEquals(specA.hours, specB.hours);
  assertArrayEquals(specA.days, specB.days);
  assertArrayEquals(specA.months, specB.months);
  assertArrayEquals(specA.weekdays, specB.weekdays);
}


function testSpec() {
  var spec = new sage.cron.Spec('@daily');

  var seconds_array = [0];
  var minutes_array = [0];
  var hours_array = [0];

  var days_range = new sage.util.Range(1, 31);
  var days_array = days_range.getValues();

  var months_range = new sage.util.Range(1, 12);
  var months_array = months_range.getValues();

  var weekdays_range = new sage.util.Range(1, 7);
  var weekdays_array = weekdays_range.getValues();

  assertArrayEquals(seconds_array, spec.seconds);
  assertArrayEquals(minutes_array, spec.minutes);
  assertArrayEquals(hours_array, spec.hours);
  assertArrayEquals(days_array, spec.days);
  assertArrayEquals(months_array, spec.months);
  assertArrayEquals(weekdays_array, spec.weekdays);
}

function testsSpecParse() {
  var specA = new sage.cron.Spec("@daily");
  var specB = sage.cron.Spec.parse("@daily");
  assertSpecArraysEquals(specA, specB);
};

function testSpecNext() {
  var expected, actual;

  expected = [
    new Date(951775200000),
    new Date(1078005600000),
    new Date(1204236000000),
    new Date(1330466400000),
    new Date(1456696800000),
    new Date(1582927200000)
  ];

  actual = [];


  var spec = new sage.cron.Spec('0 0 0 29 2 *');
  var a = 946677600000; // jan 1 2000
  var b = 1577829600000; // jan 1 2020

  var date = new Date(a);
  var last = new Date(b);
  while (date < last) {
    date = spec.next(date);
    actual.push(date);
  }
  ;

  assertArrayEquals(expected, actual);
}


function testIssue01() {
  // assume it's 19:32:24
  var now = new Date();
  now.setHours(19);
  now.setMinutes(32);
  now.setSeconds(24);

  var expected = new Date();
  expected.setTime(now.getTime());
  expected.setHours(20);
  expected.setMinutes(0);
  expected.setSeconds(0);

  var spec =
    new sage.cron.Spec("* * 20 * * *");

  var next = spec.next(now);

  assertEquals(expected.toString(), next.toString());
}
