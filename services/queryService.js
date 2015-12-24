var Doctor = require('../models/doctorModel');
var Taxonomy = require('../models/taxonomyModel');

var queryService = {
  getSpecialties: function() {
    var promise = Taxonomy.find().sort('name').exec();
    return promise;
  },
  findDoctors: function(center, specialty) {
  	var q = {};
  	if(specialty) {
  	  q.primary_specialty = specialty;
  	}
  	// TODO: adjust distance
    console.log(q);
  	var promise = Doctor.find(q)
  	.where('location.geopoint')
  	.near({center: center, maxDistance: 0.1}).limit(800).exec();
  	return promise;
  }
};

module.exports = queryService;