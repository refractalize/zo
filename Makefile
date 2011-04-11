all : zo.js zo-web.js zo-require.js

zo.js : zo-function.js zo.ejs
	node make.js zo.ejs

zo-web.js : zo-function.js zo-web.ejs
	node make.js zo-web.ejs

zo-require.js : zo-function.js zo-require.ejs
	node make.js zo-require.ejs
