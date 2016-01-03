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

$(function() {
  // consts
  var maxZoom = 12;

  // jquery selectors
  $btnSearch = $('#btn-search');
  $inputSearch = $('#input-search');
  $inputSpecialty = $('#input-specialty');
  $sidebar = $('.sidebar');
  $list = $sidebar.children('.list');

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
    scrollWheelZoom: false, 
    zoomControl: false,
    maxZoom: maxZoom
  }).setView(center, 5);
  new L.Control.Zoom({ position: 'topright' }).addTo(map);

  var markerGroupLayer = L.markerClusterGroup({
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    spiderfyOnMaxZoom: true,
  }).addTo(map);

  /* event handlers */
  $('body').on('taxonomy:update', function(e, taxonomy) {
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

  $('body').on('doctors:update', function(e, doctors) {
    if(doctors.length == 0) {
      // TODO: use bootstrap modal
      alert('no match found!');
      return false;
    }

    $list.empty();

    var markers = Marker.loadFrom(doctors);

    var geoJsonLayer = L.geoJson(markers, {
      onEachFeature: function (feature, layer) {
        var doctor = feature.properties.doctor;

        // move to model funcition
        var name = [doctor.last_name, doctor.first_name].join(', ');
        var primarySpecialty = doctor.primary_specialty;
        var address = [doctor.location.address, doctor.location.city, doctor.location.zipcode].join(', ');
        var phone = doctor.location.phone;

        var popupContent = MarkerView.popupContent(doctor);

        // list item
        // TODO: move to model
        var $item = $('<a></a>').addClass('list-item').attr('href', '#');
        $('<h5></h5>').addClass('list-item-heading').text(name).appendTo($item);
        $('<p>').addClass('list-item-text').text(primarySpecialty).appendTo($item);
        $('<p>').addClass('list-item-text').text(address).appendTo($item);
        $('<p>').addClass('list-item-text').text(phone).appendTo($item);

        $item.on('click', function(e) {
          $('a.active').removeClass('active');
          $(this).addClass('active');

          // TODO: if current zoom level < maxZoom, then zoom in?
          if (!layer._icon) layer.__parent.spiderfy();
          //layer.openPopup();

          var popup = L.popup({
            closeButton: false,
            minWidth: 200,
            offset: L.point(0, -30)
          }).setLatLng(layer._latlng)
          .setContent(popupContent)
          .openOn(map);

        });
        $item.appendTo($list);

        // marker
        layer.on('click', function(e) {
          var itemOffset = $item.offset().top;
          var listOffset = $list.offset().top;
          $list.scrollTop($list.scrollTop() + (itemOffset - listOffset));

          $item.trigger('click');
        });
      }
    });

    markerGroupLayer.clearLayers().addLayer(geoJsonLayer);
    map.fitBounds(markerGroupLayer.getBounds());
  });

  $inputSearch.keydown(function(e){ 
    var keyCode = (e.keyCode ? e.keyCode : e.which);   
    if (keyCode == 13) {
      e.preventDefault();
      $btnSearch.trigger('click');
    }
  });

  $btnSearch.on('click', function(e) {
    //$sidebar.hide();

    var input = $inputSearch.val();
    $inputSearch.val('');

    var result = validator.validateZipcode(input);
    if(!result) {
      // TODO: use bootstrap modal
      alert('invalid zipcode. should be 5 digits');
      return false;
    }

    var specialty = $inputSpecialty.val();
    if(specialty.toLowerCase() == 'all') {
      specialty = null;
    }


    var promise = Geocoder.geocode(input);
    promise.done(function(data) {
      if(data.length == 0) {
        // TODO: use bootstrap modal
        alert('no match found for ' + input);
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