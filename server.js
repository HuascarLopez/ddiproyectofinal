// server.js

// init project (using Express)
const express = require('express'),
    app = express(),
    compileSass = require('express-compile-sass');

// serve all .sass and .scss files in /public as CSS
app.use(compileSass({
    root: 'public', // directory containing files to compile
    sourceMap: true, // includes base64 encoded source maps in output css
    sourceComments: true, // includes source comments in output css
    watchFiles: true, // watch sass files and update mtime on main files for each change
    logToConsole: true // whether or not to log errors to the console
}));

app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})
 
// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
});