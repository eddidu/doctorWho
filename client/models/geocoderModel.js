var Config = require('../config');

var Geocoder = {
  url: Config.getGeocodeUrl(),
  geocode: function(zipcode) {
    var promise = $.getJSON(this.url, {postalcode: zipcode, limit: 1, format: 'json'});
    return promise;
  }
};

module.exports = Geocoder;