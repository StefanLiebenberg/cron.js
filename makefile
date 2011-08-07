files=lib/extentions.js lib/singletons/cronspec.js lib/classes/cron.js lib/singletons/crontab.js
main: build/cron.js
	mkdir build -p;
	cat $(files) > build/cron.js;

build/cron.js : $(files)
	mkdir build/ -p;
	cat $(files) > build/cron.js

build/cron.min.js : build/cron.js
	cat build/cron.js | closure > build/cron.min.js

build/cron.compiled.js : build/cron.js
	cat build/cron.js | closure > build/cron.compiled.js

compile: build/cron.compiled.js
minify: build/cron.min.js

all: main compile minify
