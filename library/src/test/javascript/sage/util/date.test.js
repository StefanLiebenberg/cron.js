goog.provide('tests.slieb.util.date');
goog.require('goog.testing.jsunit');
goog.require('slieb.util.date');


function testAddTime() {
  var a, b, date, time;
  a = 1262296800000;
  b = 1262300400000;
  time = 3600000;
  date = new Date(a);

  assertEquals(a, date.getTime());

  slieb.util.date.addTime(date, time);
  assertEquals(b, date.getTime());

  slieb.util.date.addTime(date, -time);
  assertEquals(a, date.getTime());
}

function testAddSeconds() {
  var a, b, date, time;
  a = 1262296800000;
  b = 1262300400000;
  time = 3600;
  date = new Date(a);

  assertEquals(a, date.getTime());

  slieb.util.date.addSeconds(date, time);
  assertEquals(b, date.getTime());

  slieb.util.date.addSeconds(date, -time);
  assertEquals(a, date.getTime());
}


function testAddMinutes() {
  var a, b, date, time;
  a = 1262296800000;
  b = 1262300400000;
  time = 60;
  date = new Date(a);

  assertEquals(a, date.getTime());

  slieb.util.date.addMinutes(date, time);
  assertEquals(b, date.getTime());

  slieb.util.date.addMinutes(date, -time);
  assertEquals(a, date.getTime());
}


function testAddHours() {
  var a, b, date, time;
  a = 1262296800000;
  b = 1262300400000;
  time = 1;
  date = new Date(a);

  assertEquals(a, date.getTime());

  slieb.util.date.addHours(date, time);
  assertEquals(b, date.getTime());

  slieb.util.date.addHours(date, -time);
  assertEquals(a, date.getTime());
}

function testAddDays() {
  var a, b, date, time;
  a = 1262296800000;
  b = 1263160800000;
  time = 10;
  date = new Date(a);

  assertEquals(a, date.getTime());

  slieb.util.date.addDays(date, time);
  assertEquals(b, date.getTime());

  slieb.util.date.addDays(date, -time);
  assertEquals(a, date.getTime());
}

function testAddMonths() {var a, b, dateA, dateB;
  var a, b, date, time;
  a = 1262296800000;
  b = 1296511200000;
  time = 13;
  date = new Date(a);

  assertEquals(a, date.getTime());

  slieb.util.date.addMonths(date, time);
  assertEquals(b, date.getTime());

  slieb.util.date.addMonths(date, -time);
  assertEquals(a, date.getTime());
}

function testAddYears() {var a, b, dateA, dateB;
  var a, b, date, time;
  a = 1262296800000;
  b = 1988143200000;
  time = 23;
  date = new Date(a);

  assertEquals(a, date.getTime());

  slieb.util.date.addYears(date, time);
  assertEquals(b, date.getTime());

  slieb.util.date.addYears(date, -time);
  assertEquals(a, date.getTime());
}
