SHELL := /bin/bash

files=lib/extentions.js lib/singletons/cronspec.js lib/classes/cron.js lib/classes/cronscheduler.js lib/singletons/crontab.js
main: build/cron.js
	mkdir build -p;
	cat $(files) > build/cron.js;


compile: build/cron.compiled.js
minify: build/cron.min.js

all: build/cron.compiled.js build/cron.min.js build/cron.src.js

build:
	mkdir build -p;

build/cron.compiled.js: build lint src/deps.js
	closure/library/closure/bin/build/closurebuilder.py \
		--root='closure/library' \
		--root='src' \
		--namespace='cron.js' \
		--output_mode='compiled' \
		--compiler_flags='--compilation_level=ADVANCED_OPTIMIZATIONS' \
		--compiler_flags='--warning_level=VERBOSE' \
		--compiler_flags='--jscomp_warning=checkTypes' \
		--compiler_jar='closure/compiler/compiler.jar' \
		> build/cron.compiled.js
		
build/cron.min.js: lint src/deps.js
	closure/library/closure/bin/build/closurebuilder.py \
		--root='closure/library' \
		--root='src/' \
		--namespace='cron.js' \
		--output_mode='compiled' \
		--compiler_flags='--compilation_level=SIMPLE_OPTIMIZATIONS' \
		--compiler_flags='--warning_level=VERBOSE' \
		--compiler_flags='--jscomp_warning=checkTypes' \
		--compiler_jar='closure/compiler/compiler.jar' \
		> build/cron.min.js
		
build/cron.src.js: lint src/deps.js
	closure/library/closure/bin/build/closurebuilder.py \
		--root='closure/library' \
		--root='src/' \
		--namespace='cron.js' \
		--output_mode='script' \
		> build/cron.src.js
		
lint:
	gjslint --strict -r src
	
src/deps.js:
	echo 'build deps'
