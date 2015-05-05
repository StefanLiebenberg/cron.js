goog.provide('tests.cron.js');
goog.require('cron.js');
goog.require('goog.testing.jsunit');


function testExports() {
  assertEquals(slieb.cron.Scheduler, Cron);
  assertEquals(slieb.cron.Scheduler.prototype.start, Cron.prototype.start);
  assertEquals(slieb.cron.Scheduler.prototype.stop, Cron.prototype.stop);
  assertEquals(slieb.cron.Scheduler.prototype.check, Cron.prototype.check);
  assertEquals(slieb.cron.Scheduler.prototype.add, Cron.prototype.add);
  assertEquals(slieb.cron.Spec, Cron.Spec);
  assertEquals(slieb.cron.Spec.next, Cron.Spec.next);
  assertEquals(slieb.cron.Spec.parse, Cron.Spec.parse);
  assertEquals(slieb.cron.Job, Cron.Job);
}

