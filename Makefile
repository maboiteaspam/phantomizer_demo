-include test/test.env

test_all:
	./node_modules/mocha/bin/mocha --reporter spec
