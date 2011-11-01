goog.provide('tests.sage.cron.syntax.AliasParser');
goog.require('goog.testing.jsunit');
goog.require('sage.cron.syntax.AliasParser');

var alias_parser;
function setUp() {
  alias_parser = new sage.cron.syntax.AliasParser();
}

function parse_fn(expected ) {
  return {
    parse: function(actual) {
      assertEquals(expected, actual);
    },
    aliases: {
      'aaa': '111',
      'bbb': '222',
      'ccc': '333',
      'ddd': 'XXX'
    }
  };
}

function tearDown() {
  delete alias_parser;
}

function testConstructor() {
  assertTrue(alias_parser instanceof sage.cron.syntax.AliasParser);
}

function testAliases() {
  alias_parser.parse('aaa-bbb ( ccc ) eee', parse_fn('111-222 ( 333 ) eee'));
  alias_parser.parse('ddd DDD', parse_fn('XXX XXX'));
}
