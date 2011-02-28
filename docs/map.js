var zo = require('zo').zo;

zo([1, 2, 3])
    .map(function (item, mapTo) {
        mapTo(item + 1);
    })
    .results(function (mappedItems) {
        console.log(mappedItems);
    });
