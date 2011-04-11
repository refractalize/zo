var ejs = require('ejs');
var fs = require('fs');
var _ = require('underscore');

fs.readFile('zo-function.js', 'utf-8', function (err, zo) {
	var ejsFile = process.argv[2];
	
	fs.readFile(ejsFile, 'utf-8', function (err, template) {
		if (err) {
			console.log(err.message);
			process.exit(1);
		}
		var output = ejs.render(template, {locals: {zo: zo}});
		
		var jsFile = ejsFile.replace(/\.ejs$/, '.js');
		
		fs.writeFile(jsFile, output, function (err) {
			if (err) {
				console.log(err.message);
				process.exit(1);
			}
		});
	})
});
