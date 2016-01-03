var express = require('express');
var queryService = require('../services/queryService');
var _ = require('underscore');

var router = express.Router();

router.get('/', function(req, res) {

  var promise = queryService.getSpecialties();
  promise.then(function(taxonomy) {
    var getName = function(item) {
      return item.name;
    };

    var uniqSpecialties = _.map(_.uniq(taxonomy, true, getName), getName);

    res.render('index', {title: 'Doctor WHO', specialties: uniqSpecialties});
  });
});

module.exports = router;