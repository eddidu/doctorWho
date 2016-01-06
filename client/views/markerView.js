var $ = require('jquery');

var MarkerView = {
  popupContent:  function(doctor) {
  	var name = [doctor.lastName, doctor.firstName].join(', ');
  	var primary = doctor.specialty.primary;
    var secondaries = doctor.specialty.secondaries;
  	var address = [doctor.location.address, doctor.location.city, doctor.location.zipcode].join(', ');
  	var phone = doctor.location.phone;

  	var $wrapper = $('<wrapper></wrapper>');
  	$('<div></div>').addClass('marker-title').text(name).appendTo($wrapper);
  	$('<p></p>').text(primary).appendTo($wrapper);
    $('<p></p>').text(secondaries.join(', ')).appendTo($wrapper);
  	$('<p></p>').text(address).appendTo($wrapper);
  	$('<p></p>').text(phone).appendTo($wrapper);

  	return $wrapper.html();
  }
};

module.exports = MarkerView;