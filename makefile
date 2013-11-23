SHELL := /bin/bash

main: all

all: build/cron.compiled.js build/cron.min.js build/cron.src.js

build:
	mkdir build -p;

build/cron.compiled.js: lint build src/deps.js
	closure/library/closure/bin/build/closurebuilder.py \
		--root='closure/library' \
		--root='src' \
		--compiler_flags='--js="src/deps.js"' \
		--namespace='cron.js' \
		--output_mode='compiled' \
		--compiler_flags='--compilation_level=ADVANCED_OPTIMIZATIONS' \
		--compiler_flags='--warning_level=VERBOSE' \
		--compiler_flags='--jscomp_warning=checkTypes' \
		--compiler_jar='closure/compiler/compiler.jar' \
		> build/cron.compiled.js
		
build/cron.min.js: lint build src/deps.js
	closure/library/closure/bin/build/closurebuilder.py \
		--root='closure/library' \
		--root='src/' \
		--namespace='cron.js' \
		--output_mode='compiled' \
		--compiler_flags='--compilation_level=SIMPLE_OPTIMIZATIONS' \
		--compiler_flags='--warning_level=VERBOSE' \
		--compiler_flags='--jscomp_warning=checkTypes' \
		--compiler_flags='--js="src/deps.js"' \
		--compiler_jar='closure/compiler/compiler.jar' \
		> build/cron.min.js
		
build/cron.src.js: lint build src/deps.js
	closure/library/closure/bin/build/closurebuilder.py \
		--root='closure/library' \
		--root='src/' \
		--namespace='cron.js' \
		--output_mode='script' \
		> build/cron.src.js
		
		
src/deps.js: _ALWAYS
	closure/library/closure/bin/build/depswriter.py \
		--root_with_prefix="src ../../../../src" \
    > src/deps.js;

lint:
	gjslint --strict -r src

_ALWAYS:


cli-compile: 
	java -jar bin/closure-cli.jar --config config/closure-compiled.yaml build javascript html --compile --javascriptOutputFile build2/cron.min.js

cli-test:
	java -jar bin/closure-cli.jar --config config/closure-compiled.yaml test
