function (items, pipeline) {
    pipeline = (pipeline || []);

    var runPipeline = function (items, funcs) {
        first = _(funcs).head();
        if (first) {
            first(items, function (it) { runPipeline(it, _(funcs).tail()); });
        }
    }

    var pipelineElement = function (processItem, addItem, options) {
		options = (options || {});
		var maxOutstandingProcesses = options.limit;
        pipeline.push(function (items, next) {
            var n = items.length;
            var processedItems = [];
			var pendingProcesses = [];
			var outstandingProcesses = 0;

			var canStartAnotherProcess = function () {
				return !maxOutstandingProcesses || outstandingProcesses < maxOutstandingProcesses;
			}

            if (n > 0) {
                _(items).each(function (item) {
					var process = function (doPending) {
						outstandingProcesses++;
	                    processItem(item, function (processedItem) {
	                        addItem(processedItems, item, processedItem);
	                        n--;
							outstandingProcesses--;
							var pendingProcess = pendingProcesses.shift();
							if (canStartAnotherProcess() && pendingProcess) {
								pendingProcess();
							}
	                        if (n == 0) {
	                            next(processedItems);
	                        }
	                    });
					};
					
					if (canStartAnotherProcess()) {
						process();
					} else {
						pendingProcesses.push(process);
					}
                });
            } else {
                next(processedItems);
            }
        });
        return zo(items, pipeline);
    };

    var foldl = function (first, folder) {
        pipeline.push(function (items, next) {
            var fold = function (foldedResult, index, items, next) {
                if (index >= items.length) {
                    next(foldedResult);
                } else {
                    folder(foldedResult, items[index], function (folded) {
                        process.nextTick(function () {
                            fold(folded, index + 1, items, next);
                        });
                    });
                }
            };

            fold(first, 0, items, next);
        });
        return zo(items, pipeline);
    };

    var foldr = function (first, folder) {
        pipeline.push(function (items, next) {
            var fold = function (foldedResult, index, items, next) {
                if (index < 0) {
                    next(foldedResult);
                } else {
                    folder(foldedResult, items[index], function (folded) {
                        process.nextTick(function () {
                            fold(folded, index - 1, items, next);
                        });
                    });
                }
            };

            fold(first, items.length - 1, items, next);
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
        map: function (mapper, options) {
            return pipelineElement(mapper, function (mappedItems, item, mappedItem) {
                mappedItems.push(mappedItem);
            }, options);
        },
        foldr: foldr,
        foldl: foldl,
        reduce: foldl,
        reduceRight: foldr,
        select: function (selector, options) {
            return pipelineElement(selector, function (selectedItems, item, itemSelected) {
                if (itemSelected) selectedItems.push(item);
            }, options);
        },
        each: function (doForEach, options) {
            return pipelineElement(doForEach, function (selectedItems, item, itemSelected) {
                selectedItems.push(item);
            }, options);
        },
    };
};
