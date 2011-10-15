function Cron(spec, job) {
  var cron = this;
  cron.cronspec = CronSpec.parse(spec);
  cron.job = job;
  cron.last_at = null;
  cron.getNextAt();
}

Cron.prototype = {
  getNextAt: function() {
    if (this.last_at) {
      var tempdate = CronSpec.next(this.last_at, this.cronspec);
      var now = new Date();
      while (tempdate < now) tempdate = CronSpec.next(tempdate, this.cronspec);
      this.next_at = tempdate;
    } else {
      this.next_at = CronSpec.next(new Date(), this.cronspec);
    }
  },

  getTimeout: function() {
    if (!this.next_at) { this.getNextAt(); }
    return Math.max(0 , this.next_at - new Date());
  },
  run: function() {
    this.last_at = new Date();
    // execute the job async;
    setTimeout(this.job, 0);
    this.getNextAt();
  }
};
