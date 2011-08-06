files=lib/extentions.js lib/singletons/cronspec.js lib/classes/cron.js lib/singletons/crontab.js
main: $(files)
	mkdir build -p;
	cat $(files) > build/jcron.js;
