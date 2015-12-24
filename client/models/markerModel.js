var Marker = {
  loadFrom: function(doctors) {
    var markers = {
      type: 'FeatureCollection',
      features: []
    };

    $.each(doctors, function(index, doctor) {
      var marker = {
        type: 'Feature',
        properties: {
          doctor: doctor,
          'marker-color': "#df0a2e",
          'marker-size': "medium",
          'marker-symbol': "circle"
        },
        geometry: {
          type: 'Point',
          coordinates: [
            doctor.location.geopoint[1],
            doctor.location.geopoint[0]
          ]
        }
      };
      markers.features.push(marker);
    });
    return markers;
  }
};

module.exports = Marker;