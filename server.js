// server.js
"use strict";

// init project (using Express)
const express = require("express");
const apiRoutes = require("./routes/api.js");
const bodyParser = require("body-parser");

// init Sass compiler.
const compileSass = require("express-compile-sass");

// add more packages
const fs = require("fs");
const moment = require("moment");
const mdq = require("mongo-date-query");
const json2csv = require("json2csv").parse;
const path = require("path");
const fields = ["datapoints"];

// MongoDB conecttion using Mongoose
const mongoose = require("mongoose");
const mongo = require("mongodb");
const config = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
};

// Room Schema
const Room = require("./models/Room");

// iinit App and it's bodyParse
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve all .sass and .scss files in /public as CSS
app.use(
  compileSass({
    root: "public", // directory containing files to compile
    sourceMap: true, // includes base64 encoded source maps in output css
    sourceComments: true, // includes source comments in output css
    watchFiles: true, // watch sass files and update mtime on main files for each change
    logToConsole: true // whether or not to log errors to the console
  })
);

// serve from public
app.use("/public", express.static(process.cwd() + "/public"));

// serve index page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404).sendFile(__dirname + "/views/404.html");
});

// Routing of the app
apiRoutes(app);

// Download info from the api
app.post("/api/download/BjpgUJTT", function(req, res) {
  Room.find({ _id: "BjpgUJTT" }, function(err, room) {
    if (err) {
      return res.status(500).json({ err });
    } else {
      let csv;
      try {
        csv = json2csv(room, { fields });
      } catch (err) {
        return res.status(500).json({ err });
      }
      const dateTime = moment().format("YYYYMMDDhhmmss");
      const filePath = path.join(
        __dirname,
        "..",
        "public",
        "exports",
        "csv-" + dateTime + ".csv"
      );
      fs.writeFile(filePath, csv, function(err) {
        if (err) {
          return res.json(err).status(500);
        } else {
          setTimeout(function() {
            fs.unlinkSync(filePath); // delete this file after 30 seconds
          }, 30000);
          return res.json("/exports/csv-" + dateTime + ".csv");
        }
      });
    }
  });
});

// listen for requests
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
