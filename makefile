SHELL := /bin/bash

main: all

all: clean create_tests test build/cron.cc.js build/cron.debug.js

clean: clean_tests
	rm -rf build;

build/cron.cc.js: check 
	java -jar bin/closure-cli.jar build javascript \
	  --compile \
	  --javascriptOutputFile build/cron.cc.js

build/cron.debug.js: check
	java -jar bin/closure-cli.jar build javascript \
          --compile --debug \
          --javascriptOutputFile build/cron.debug.js
		
lint:
	gjslint --strict -r src

test: _ALWAYS
	java -jar bin/closure-cli.jar test run

create_tests: clean_tests
	java -jar bin/closure-cli.jar test create

clean_tests:
	find tests -name "*.test.js.html" | xargs rm

check: src/closure-library/.git

src/closure-library/.git:
	git submodule init
	git submodule update

version: _ALWAYS
	java -jar bin/closure-cli.jar  --version

_ALWAYS:
	
