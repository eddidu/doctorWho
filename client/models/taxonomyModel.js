var Config = require('../config');

var Taxonomy = {
  url: Config.getAppUrl() + '/taxonomy',
  fetch: function() {
    $.getJSON(this.url, function(data) {
      $('body').trigger('taxonomy:update', [data])
    });
  }
};

module.exports = Taxonomy;