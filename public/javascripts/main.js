// functions
var Url = {
  getAppUrl: function() {
    return location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
  },
  getGeocodeUrl: function() {
    return 'http://nominatim.openstreetmap.org/search';
  }
};

var Doctor = {
  url: Url.getAppUrl() + '/api/doctors',
  fetch: function(params) {
    $.getJSON(this.url, params, function(data) {
      $('body').trigger('doctorsUpdate', [data]);
    });
  }
};

var Taxonomy = {
  url: Url.getAppUrl() + '/api/taxonomy',
  fetch: function() {
    $.getJSON(this.url, function(data) {
      $('body').trigger('taxonomyUpdate', [data])
    });
  }
};

var Marker = {
  loadFrom: function(doctors) {
    var markers = {
      type: 'FeatureCollection',
      features: []
    };

    $.each(doctors, function(index, doctor) {
      var title = $('<div class="marker-title"></div>').text(doctor.first_name + ' ' + doctor.last_name);
      var content = $('<p></p>').html(
        doctor.address
      );

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

$(window).on('load resize', function(){
  $('#map').height($(window).height() - 50);
});

// document ready
$(function() {
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    $('#specialty').selectpicker('mobile');
  }

  Taxonomy.fetch();

  // initialize the map
  // TODO: centenr <---- user location
  var center = [39.372033, -103.332486];
  L.mapbox.accessToken = 'pk.eyJ1IjoiZWRkaWR1IiwiYSI6ImNpaWV5YXpsbTAxajB1M2tzYXZyZ2VuN2kifQ.RLcGUgUEw1C0E4ENFhOcAQ';
  var map = L.mapbox.map('map', 'mapbox.streets', {
    scrollWheelZoom: false
  }).setView(center, 5);
  var markerLayer = L.mapbox.featureLayer().addTo(map);

  markerLayer.on('layeradd', function(e) {
    var marker = e.layer,
    doctor = marker.feature.properties.doctor;
    // TODO: use html template
    var popupContent =  '<div class="marker-title">' + [doctor.first_name, doctor.last_name].join(' ') + '</div>' +
    '<p>' + doctor.specialties.join(', ') + '</p>' +
    '<p>' + [doctor.location.address, doctor.location.city, doctor.location.zipcode].join(', ') + '</p>' + 
    '<p>' + doctor.location.phone + '</p>';

    // http://leafletjs.com/reference.html#popup
    marker.bindPopup(popupContent, {
      closeButton: false,
      minWidth: 200
    });
  });

  $('body').on('taxonomyUpdate', function(e, taxonomy) {
    var $specialty = $('#specialty');
    $.each(taxonomy, function(index, code) {
      $specialty.append($('<option></option>').text(code).val(code));
    });
    $specialty.selectpicker('refresh');
  });

  $('body').on('doctorsUpdate', function(e, doctors) {
    $('#adv-search-modal').modal('hide');

    var markers = Marker.loadFrom(doctors);
    markerLayer.setGeoJSON(markers);
    map.fitBounds(markerLayer.getBounds());
  });

  $('#search').keydown(function(e){ 
    var keyCode = (e.keyCode ? e.keyCode : e.which);   
    if (keyCode == 13) {
      e.preventDefault();
      $('#btn-search').trigger('click');
    }
  });

  $('#zipcode').keydown(function(e){ 
    var keyCode = (e.keyCode ? e.keyCode : e.which);   
    if (keyCode == 13) {
      e.preventDefault();
      $('#btn-adv-search').trigger('click');
    }
  });

  $('#btn-search').on('click', function(e) {
    var input = $('#search').val();
    // TODO: move it to a separate function -- (geocode)
    var url = Url.getGeocodeUrl();
    $.getJSON(url, {postalcode: input, limit: 1, format: 'json'}, function(data) {
      if(data.length == 0) {
        // TODO: use bootstrap modal
        alert('no match found');
        return;
      }
      Doctor.fetch({center: [data[0].lat, data[0].lon]});      
    });
  });

  $('#btn-adv-search').on('click', function(e) {
    var zipcode = $('#zipcode').val();
    var specialty = $('#specialty').val();

    // TODO: move it to a separate function -- (geocode)
    var url = Url.getGeocodeUrl();
    $.getJSON(url, {postalcode: zipcode, limit: 1, format: 'json'}, function(data) {
      if(data.length == 0) {
        // TODO: use bootstrap modal
        alert('no match found ' + zipcode);
        return;
      }
      Doctor.fetch({center: [data[0].lat, data[0].lon], specialty: specialty});
    });
  });

  $('#specialty').on('click', function(e) {
    e.preventDefault();
  });
});