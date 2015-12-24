var Doctor = require('./models/doctorModel');
var Taxonomy = require('./models/taxonomyModel');
var Marker = require('./models/markerModel');
var Geocoder = require('./models/geocoderModel');
var Config = require('./config');
var MarkerView = require('./views/markerView');

// TODO: use validator plugin
var validator = {
  validateZipcode: function(zipcode) {
    if((/^\d{5}$/.test(zipcode))) {
      return true;
    }
    return false;
  }
};

$(window).on('load resize', function(){
  $('#map').height($(window).height() - 50);
});

$(function() {
  // jquery selectors
  $btnAdvSearch = $('#btn-adv-search');
  $btnSearch = $('#btn-search');
  $inputMainSearch = $('#search');
  $inputSpecialty = $('#specialty');
  $inputZipcode = $('#zipcode');

  // enable scroll selectbox for mobile
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    $inputSpecialty.selectpicker('mobile');
  }

  Taxonomy.fetch();

  // TODO: centenr <---- user location
  var center = [39.372033, -103.332486];

  // initialize the map
  L.mapbox.accessToken = 'pk.eyJ1IjoiZWRkaWR1IiwiYSI6ImNpaWV5YXpsbTAxajB1M2tzYXZyZ2VuN2kifQ.RLcGUgUEw1C0E4ENFhOcAQ';
  var map = L.mapbox.map('map', 'mapbox.streets', {
    scrollWheelZoom: false
  }).setView(center, 5);
  var markerLayer = L.mapbox.featureLayer().addTo(map);
  markerLayer.on('layeradd', function(e) {
    var marker = e.layer;
    var doctor = marker.feature.properties.doctor;
    var popupContent = MarkerView.popupContent(doctor);
    // http://leafletjs.com/reference.html#popup
    marker.bindPopup(popupContent, {
      closeButton: false,
      minWidth: 200
    });
  });

  /* event handlers */
  $('body').on('taxonomyFetched', function(e, taxonomy) {
    if(taxonomy.length == 0) {
      // TODO: use bootstrap modal
      alert('taxonomy not found!');
      return false;
    }
    $.each(taxonomy, function(index, code) {
      $inputSpecialty.append($('<option></option>').text(code).val(code));
    });
    $inputSpecialty.selectpicker('refresh');
  });

  $('body').on('doctorsFetched', function(e, doctors) {
    $('#adv-search-modal').modal('hide');

    if(doctors.length == 0) {
      // TODO: use bootstrap modal
      alert('no match found!');
      return false;
    }    

    var markers = Marker.loadFrom(doctors);
    markerLayer.setGeoJSON(markers);
    map.fitBounds(markerLayer.getBounds());
  });

  $inputMainSearch.keydown(function(e){ 
    var keyCode = (e.keyCode ? e.keyCode : e.which);   
    if (keyCode == 13) {
      e.preventDefault();
      $btnSearch.trigger('click');
    }
  });

  $inputZipcode.keydown(function(e){ 
    var keyCode = (e.keyCode ? e.keyCode : e.which);   
    if (keyCode == 13) {
      e.preventDefault();
      $btnAdvSearch.trigger('click');
    }
  });

  $btnSearch.on('click', function(e) {
    var input = $inputMainSearch.val();
    $inputMainSearch.val('');

    var result = validator.validateZipcode(input);
    if(!result) {
      // TODO: use bootstrap modal
      alert('invalid zipcode. should be 5 digits');
      return false;
    }

    var promise = Geocoder.geocode(input);
    promise.done(function(data) {
      if(data.length == 0) {
        // TODO: use bootstrap modal
        alert('no match found for ' + input);
        return false;
      }
      Doctor.fetch({center: [data[0].lat, data[0].lon]});
    }).fail(function() {
      // TODO: use bootstrap modal
      alert('geocode failed!');
    }); 
  });

  $btnAdvSearch.on('click', function(e) {
    var zipcode = $inputZipcode.val();
    var specialty = $inputSpecialty.val();
    $inputZipcode.val('');
    $inputSpecialty.selectpicker('val', '');

    var result = validator.validateZipcode(zipcode);
    if(!result) {
      // TODO: use bootstrap modal
      alert('invalid zipcode. should be 5 digits');
      return false;
    }

    var promise = Geocoder.geocode(zipcode);
    promise.done(function(data) {
      if(data.length == 0) {
        // TODO: use bootstrap modal
        alert('no match found for ' + zipcode);
        return false;
      }
      Doctor.fetch({center: [data[0].lat, data[0].lon], specialty: specialty});
    }).fail(function() {
      // TODO: use bootstrap modal
      alert('geocode failed!');
    });
  });

  $inputSpecialty.on('click', function(e) {
    e.preventDefault();
  });
});