"use strict";

/*
  Conection to MongoDB cluster using Mongoose
*/
const mongoose = require("mongoose");
const mongo = require("mongodb");
const config = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
};

mongoose.connect(process.env.DATABASE, config);

/*
  Import MongoDB schemas
*/
const DataPoint = require("../models/DataPoint");
const Room = require("../models/Room");

/*
  Export API routes
*/
module.exports = function(app) {
  app
    .route("/api/rooms")
    .get(function(req, res) {
      Room.find({}, function(err, rooms) {
        let roomList = [];

        if (err) {
          console.log("Error");
        }

        rooms.forEach(function(room) {
          roomList.push({
            _id: room._id,
            room: room.room,
            datapoints: room.datapoints,
            datapointscount: room.datapoints.length
          });
        });

        return res.status(200).json(roomList);
      });
    })

    .post(function(req, res) {
      const title = req.body.title;
      const values = [];
      const _id = generateID();

      if (!title) {
        res.send("Missing Room Title");
      }

      const newRoom = new Room({ _id: _id, room: title, datapoint: values });
      newRoom.save(function(err) {
        if (err) {
          console.log(err);
          return;
        }
        return res
          .status(200)
          .json({ _id: _id, room: title, datapoints: values });
      });
    })

    .delete(function(req, res) {
      Room.deleteMany({}, function(err, removed) {
        if (err) {
          console.log("Error");
        }
        console.log("Complete Delete Successful");
        return res.status(200).json("Complete Delete Successful");
      });
    });

  app
    .route("/api/rooms/:id")
    .get(function(req, res) {
      const roomid = req.params.id;
      let retrieveRoom = {};

      Room.find({ _id: roomid }, function(err, room) {
        if (err) {
          console.log("Error");
        }

        if (!room) {
          return res.status(400).send("No room Exists");
        }

        room.forEach(function(room) {
          retrieveRoom = {
            _id: room._id,
            room: room.room,
            datapoints: room.datapoints,
            datapointscount: room.datapoints.length
          };
        });

        return res.status(200).json(retrieveRoom);
      });
    })

    .post(function(req, res) {
      const roomid = req.params.id;
      const datapoint = req.body.datapoint;
      let category;

      if (datapoint > 10) {
        category = "ON";
      } else {
        category = "OFF";
      }

      Room.findOne({ _id: roomid }, function(err, room) {
        if (err) {
          console.log("Error");
        }

        if (room) {
          const newDataPoint = {
            _id: generateID(),
            date: new Date(),
            value: datapoint,
            category: category
          };
          room.datapoints.push(newDataPoint);
          room.save((err, pro) => {
            if (err) {
              console.log("Error");
            }
            return res.status(200).json({
              _id: generateID(),
              date: new Date(),
              value: datapoint,
              category: category
            });
          });
        }
      });
    })

    .delete(function(req, res) {
      const roomid = req.params.id;
      Room.deleteOne({ _id: roomid }, function(err, removed) {
        if (err) {
          console.log("Error");
        }
        console.log("Delete Successful");
        return res.status(200).json("delete successful");
      });
    });

  app.route("/api/rooms/:id/:value").post(function(req, res) {
    const roomid = req.params.id;
    const datapoint = req.params.value;
    let category;

    if (datapoint > 10) {
      category = "ON";
    } else {
      category = "OFF";
    }

    Room.findOne({ _id: roomid }, function(err, room) {
      if (err) {
        console.log("Error");
      }

      if (room) {
        const newDataPoint = {
          _id: generateID(),
          date: new Date(),
          value: datapoint,
          category: category
        };
        room.datapoints.push(newDataPoint);
        room.save((err, pro) => {
          if (err) {
            console.log("Error");
          }
          return res.status(200).json({
            _id: generateID(),
            date: new Date(),
            value: datapoint,
            category: category
          });
        });
      }
    });
  });
};

/*
  Function to generate room {:id}
*/

function generateID() {
  let id = "";
  let values = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (let i = 0; i < 8; i++) {
    id += values.charAt(Math.floor(Math.random() * values.length));
  }
  return id;
}
