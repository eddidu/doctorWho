var express = require('express');
var queryService = require('../services/queryService');
var _ = require('underscore');

var router = express.Router();

router.get('/', function(req, res) {

  var promise = queryService.getSpecialtyGroups();
  promise.then(function(specialtyGroups) {
    res.render('index', {title: 'Doctor WHO', specialtyGroups: specialtyGroups});
  });
});

module.exports = router;