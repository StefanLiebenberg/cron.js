goog.provide('tests.cron.js');
goog.require('cron.js');
goog.require('goog.testing.jsunit');


function testExports() {
  assertEquals(sage.cron.Scheduler, Cron);
  assertEquals(sage.cron.Scheduler.prototype.start, Cron.prototype.start);
  assertEquals(sage.cron.Scheduler.prototype.stop, Cron.prototype.stop);
  assertEquals(sage.cron.Scheduler.prototype.check, Cron.prototype.check);
  assertEquals(sage.cron.Scheduler.prototype.add, Cron.prototype.add);
  assertEquals(sage.cron.Spec, Cron.Spec);
  assertEquals(sage.cron.Spec.next, Cron.Spec.next);
  assertEquals(sage.cron.Spec.parse, Cron.Spec.parse);
  assertEquals(sage.cron.Job, Cron.Job);
}
