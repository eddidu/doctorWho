var Doctor = require('../models/doctorModel');
var Taxonomy = require('../models/taxonomyModel');

var queryService = {
  getSpecialtyGroups: function() {
    var promise = Taxonomy.find().sort('name').exec();
    return promise;
  },
  findDoctors: function(center, group) {
  	var q = {};
  	if(group) {
  	  q = {"specialty.group": group}
  	}
  	// TODO: adjust distance
  	var promise = Doctor.find(q)
  	.where('location.geopoint')
  	.near({center: center, maxDistance: 0.1}).limit(800).exec();
  	return promise;
  }
};

module.exports = queryService;