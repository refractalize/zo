var _ = require('underscore');

var zo = function (items, pipeline) {
    pipeline = (pipeline || []);

    var runPipeline = function (items, funcs) {
        first = _(funcs).head();
        if (first) {
            first(items, function (it) { runPipeline(it, _(funcs).tail()); });
        }
    }

    var pipelineElement = function (processItem, addItem) {
        pipeline.push(function (items, next) {
            var n = items.length;
            var processedItems = [];

            if (n > 0) {
                _(items).each(function (item) {
                    processItem(item, function (processedItem) {
                        addItem(processedItems, item, processedItem);
                        n--;
                        if (n == 0) {
                            next(processedItems);
                        }
                    });
                });
            } else {
                next(processedItems);
            }
        });
        return zo(items, pipeline);
    };

    var foldl = function (first, folder) {
        pipeline.push(function (items, next) {
            var xyz = function (foldedResult, index, items, next) {
                if (index >= items.length) {
                    next(foldedResult);
                } else {
                    folder(foldedResult, items[index], function (folded) {
                        xyz(folded, index + 1, items, next);
                    });
                }
            };

            xyz(first, 0, items, next);
        });
        return zo(items, pipeline);
    };

    var foldr = function (first, folder) {
        pipeline.push(function (items, next) {
            var xyz = function (foldedResult, index, items, next) {
                if (index < 0) {
                    next(foldedResult);
                } else {
                    folder(foldedResult, items[index], function (folded) {
                        xyz(folded, index - 1, items, next);
                    });
                }
            };

            xyz(first, items.length - 1, items, next);
        });
        return zo(items, pipeline);
    };

    return {
        results: function (f) {
            pipeline.push(function (items, next) {
                f(items);
            });
            runPipeline(items, pipeline);
        },
        map: function (mapper) {
            return pipelineElement(mapper, function (mappedItems, item, mappedItem) {
                mappedItems.push(mappedItem);
            });
        },
        foldr: foldr,
        foldl: foldl,
        reduce: foldl,
        reduceRight: foldr,
        select: function (selector) {
            return pipelineElement(selector, function (selectedItems, item, itemSelected) {
                if (itemSelected) selectedItems.push(item);
            });
        },
        each: function (doForEach) {
            return pipelineElement(doForEach, function (selectedItems, item, itemSelected) {
                selectedItems.push(item);
            });
        },
    };
};

exports.zo = zo;
