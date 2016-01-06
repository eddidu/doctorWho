var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taxonomySchema = new Schema({
  _id: String,
  name: String
});

var Taxonomy = mongoose.model('Taxonomy', taxonomySchema, 'specialtyGroups');

module.exports = Taxonomy;