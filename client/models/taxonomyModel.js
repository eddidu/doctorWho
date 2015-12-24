var Config = require('../config');

var Taxonomy = {
  url: Config.getAppUrl() + '/taxonomy',
  fetch: function() {
    $.getJSON(this.url, function(data) {
      $('body').trigger('taxonomyFetched', [data])
    });
  }
};

module.exports = Taxonomy;