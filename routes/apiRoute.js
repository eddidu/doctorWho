var express = require('express');
var _ = require('underscore');
var queryService = require('../services/queryService');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('available apis: ["taxonomy", "doctors"]\n');
});

// TODO: deprecated
router.get('/taxonomy', function(req, res, next) {
  var promise = queryService.getSpecialtyGroups();
  promise.then(function(taxonomy) {
    // TODO: move to the model?
    var getName = function(item) {
      return item.name;
    };

    var uniqSpecialties = _.map(_.uniq(taxonomy, true, getName), getName);
    res.json(uniqSpecialties);
  });
});

router.get('/doctors', function(req, res, next) {
  // TODO: find location from the address... 
  var params = req.query;
  var center = params.center;
  // address, name
  params.query;
  var specialty = params.specialty;

  params.address;
  params.zipcode;
  params.country;
  params.city;

  var promise = queryService.findDoctors(center, specialty);
  promise.then(function(doctors) {
    res.json(doctors);
  });
});

module.exports = router;