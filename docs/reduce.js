var zo = require('zo').zo;

zo([1, 2, 3])
    .reduce(0, function (sum, item, foldInto) {
        foldInto(sum + item);
    })
    .results(function (sum) {
        console.log(sum);
    });
