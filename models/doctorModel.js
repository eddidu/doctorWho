var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var doctorSchema = new Schema({
  _id: Number,
  firstName: String,
  lastName: String,
  location: {
    address: String,
    city: String,
    zipcode: String,
    country: String,
    phone: Number,
    geopoint: {type: [Number], index: '2d'}
  },
  specialty: {
    group: String,
    primary: String,
    secondaries: [String]
  }
});

var Doctor = mongoose.model('Doctor', doctorSchema, 'doctors');

module.exports = Doctor;