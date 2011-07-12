var assert = require('assert');
var zo = require('./zo').zo;
require('../cupoftea/cupoftea');

var assertCorrectResult = function (result) {
    assert.deepEqual(result, [1, 2, 3, 4]);
};

spec('each', function () {
	var list = [1, 2, 3, 4];
	
	spec('sync', function () {
		var resultItems = [];
		
		zo([1, 2, 3, 4]).each(function (item, done) {
			resultItems.push(item);
			done();
		}).results(shouldCall(function (items) {
			assertCorrectResult(resultItems);
		}));
	});
	
	spec('async', function () {
		var resultItems = [];
		
		zo([1, 2, 3, 4]).each(function (item, done) {
			process.nextTick(function () {
				resultItems.push(item);
				done();
			})
		}).results(shouldCall(function (items) {
			assertCorrectResult(resultItems);
		}));
	});
	
	spec('limits outstanding functions', function () {
		var resultItems = [];
		var outstanding = 0;
		
		zo([1, 2, 3, 4]).each(function (item, done) {
			outstanding++;
			assert.ok(outstanding <= 2, 'expected maximum of 2 outstanding functions, got ' + outstanding);
			
			process.nextTick(function () {
				resultItems.push(item);
				outstanding--;
				done();
			})
		}, {limit: 2}).results(shouldCall(function (items) {
			assertCorrectResult(resultItems);
		}));
	});
});

spec('reduce left', function () {
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

spec('callstack', function () {
    var items = [];
    var numberOfItems = 10000000;
    for (var n = 0; n < numberOfItems; n++) {
        items.push(n);
    }

	console.log('items');

    zo(items).reduce(0, function (memo, item, into) {
        into(memo + 1);
    }).results(shouldCall(function (res) {
        assert.equal(res, numberOfItems);
    }));
});
