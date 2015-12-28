var $ = require('jquery');

var MarkerView = {
  popupContent:  function(doctor) {
  	var name = [doctor.last_name, doctor.first_name].join(', ');
  	var primarySpecialty = doctor.primary_specialty;
  	var address = [doctor.location.address, doctor.location.city, doctor.location.zipcode].join(', ');
  	var phone = doctor.location.phone;

  	var $wrapper = $('<wrapper></wrapper>');
  	$('<div></div>').addClass('marker-title').text(name).appendTo($wrapper);
  	$('<p></p>').text(primarySpecialty).appendTo($wrapper);
  	$('<p></p>').text(address).appendTo($wrapper);
  	$('<p></p>').text(phone).appendTo($wrapper);

  	return $wrapper.html();
  }
};

module.exports = MarkerView;