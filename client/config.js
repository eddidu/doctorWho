var Config = {
  getAppUrl: function() {
    return location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + '/api';
  },
  getGeocodeUrl: function() {
    return 'http://nominatim.openstreetmap.org/search';
  }
};

module.exports = Config;