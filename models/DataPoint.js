/* 
Datapoint Schema to be inserted in a room array database 
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let DataPointSchema = new Schema({
  _id: { type: String},
  date: { type: Date},
  value: { type: Number},
  category: { type: String}
});

module.exports = mongoose.model("DataPoint", DataPointSchema);
