var assert = require('assert');
var zo = require('./zo').zo;
require('../cupoftea/cupoftea');

spec('integers', function () {
    var i = 0;

    spec('should be zero', function () {
        assert.equal(i, 0);
    });

    spec('should be greater than one', function () {
        assert.equal(i, 0);
    });
});

spec('reduce left', function () {
    var assertCorrectResult = function (result) {
        assert.deepEqual(result, [1, 2, 3, 4]);
    };

    spec('async', function () {
        zo([1, 2, 3, 4]).reduce([], function(memo, item, into) {
          process.nextTick(function() {
              memo.push(item);
              into(memo);
          });
        }).results(shouldCall(assertCorrectResult));
    });

    spec('sync', function () {
        zo([1, 2, 3, 4]).reduce([], function(memo, item, into) {
            memo.push(item);
          into(memo);
        }).results(shouldCall(assertCorrectResult));
    });
});

spec('reduce right', function () {
    var assertCorrectResult = function (result) {
        assert.deepEqual(result, [4, 3, 2, 1]);
    };

    spec('async', function () {
        zo([1, 2, 3, 4]).reduceRight([], function(memo, item, into) {
          process.nextTick(function() {
              memo.push(item);
              into(memo);
          });
        }).results(shouldCall(assertCorrectResult));
    });

    spec('sync', function () {
        zo([1, 2, 3, 4]).reduceRight([], function(memo, item, into) {
            memo.push(item);
            into(memo);
        }).results(shouldCall(assertCorrectResult));
    });
});
