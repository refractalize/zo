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
