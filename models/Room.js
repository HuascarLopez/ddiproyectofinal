/* 
Room Schema create each time you need post a new {:id} with the prototype posting method.
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const {DataPoint} = require("../models/DataPoint");

let RoomSchema = new Schema({
  _id: { type: String},
  room: { type: String},
  datapoints: []
});

module.exports = mongoose.model("Room", RoomSchema);
