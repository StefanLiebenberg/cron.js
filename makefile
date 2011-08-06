files=lib/extentions.js lib/singletons/cronspec.js lib/classes/cron.js lib/singletons/crontab.js
main: $(files)
	mkdir build -p;
	cat $(files) > build/cron.js;
compile: main
	cat build/cron.js | closure > build/cron.min.js;
	cat build/cron.js lib/exports.js | closure --compilation_level ADVANCED_OPTIMIZATIONS > build/cron.compiled.js
