var zo = require('zo').zo;

zo([1, 2, 3])
    .select(function (item, selectIf) {
        selectIf(item > 1);
    })
    .results(function (selectedItems) {
        console.log(selectedItems);
    });
