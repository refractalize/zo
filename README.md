# zo

What _is_ zo?

Zo is a asynchronous query language providing the usual functional programming list operators like `map`, `select` and `reduce`, but all in an async-friendly style, so they're ready to use while performing async IO operations in node.js.

# Installation

    npm install zo

# Operation

## require

    var zo = require('zo').zo;

## map

    zo([1, 2, 3])
        .map(function (item, mapTo) {
            mapTo(item + 1);
        })
        .results(function (mappedItems) {
            console.log(mappedItems);
        });

Produces: `[ 2, 3, 4 ]`

## select

    zo([1, 2, 3])
        .select(function (item, selectIf) {
            selectIf(item > 1);
        })
        .results(function (selectedItems) {
            console.log(selectedItems);
        });

Produces: `[ 2, 3 ]`

## reduce (also foldl)

    zo([1, 2, 3])
        .reduce(0, function (sum, item, reduceInto) {
            reduceInto(sum + item);
        })
        .results(function (sum) {
            console.log(sum);
        });

Produces: `6`

See also `reduceRight`, which is a synonym for `foldr`

## each

    zo([1, 2, 3])
        .each(function (item, done) {
            console.log('item: ' + item);
            done();
        })
        .results(function (items) {
            console.log('count: ' + items.length);
        });

Produces:

    item: 1
    item: 2
    item: 3
    count: 3

## Async IO

But the whole point is when you mix it with async IO:

    var fs = require('fs');
    var zo = require('zo').zo;

    fs.readdir('.', function (err, filesAndDirectories) {
        zo(filesAndDirectories)
            .map(function (file, mapTo) {
                fs.stat(file, function (err, stat) {
                    mapTo({file: file, stat: stat});
                });
            })
            .select(function (fileAndStat, selectIf) {
                selectIf(fileAndStat.stat.isFile() && !/^\./.test(fileAndStat.file));
            })
            .map(function (fileAndStat, mapTo) {
                mapTo(fileAndStat.file + ': ' + fileAndStat.stat.size + ' bytes');
            })
            .each(function (fileWithSize, done) {
                console.log(fileWithSize);
                done();
            })
            .results(function (files) {
                console.log();
                console.log(files.length + ' files');
            });
    });
