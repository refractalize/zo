var zo = require('zo').zo;

zo([1, 2, 3])
    .each(function (item, done) {
        console.log('item: ' + item);
        done();
    })
    .results(function (items) {
        console.log('count: ' + items.length);
    });
