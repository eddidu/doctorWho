var Config = require('../config');

var Doctor = {
  url: Config.getAppUrl() + '/doctors',
  fetch: function(params) {
    $.getJSON(this.url, params, function(data) {
      $('body').trigger('doctors:update', [data]);
    });
  }
};

module.exports = Doctor;