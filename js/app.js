$(document).ready(function(){
	// Device Event Listener
	document.addEventListener("deviceready", onDeviceReady, false);
});

// Check Device is Ready
function onDeviceReady(){
	console.log('Device Ready...');
	
	$('#show_more_location').click(function(e){
		e.preventDefault();
		getMoreLocation();
	});

	$('#clear_info').click(function(e){
		e.preventDefault();
		clearInfo();
	});

	getDate();

	getLocation();
	
	$('#other_location').click(function(e){
		e.preventDefault();
		getOtherLocation()
	});
}

// Get, Format & Display Current Date
function getDate(){
	var currentdate = new Date(); 
	var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

	$('#datetime_display').html(datetime);
}

// Get Current User Location
function getLocation(){
	console.log('Getting Users Location...');

	navigator.geolocation.getCurrentPosition(function(position){
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		var city = '';
		var state = '';
		var html = '';

		$.ajax({
			url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon,
			datatype: 'jsonp',
			success: function(response){
				city = response.results[0].address_components[2].long_name;
				state = response.results[0].address_components[4].short_name;

				html = '<h1>'+city+', '+state+'</h1>';

				$('#myLocation').html(html);
				
				// Get Weather Info
				getWeather(city, state);

				$('#show_more_weather').click(function(e){
					e.preventDefault();

				// Close Dropdown Menu
				$('.navbar-toggle').click();

					getMoreWeather(city, state);
				});
			}
		});
	});
}

// Get extra location info
function getMoreLocation(){
	// Close dropdown menu
	$('.navbar-toggle').click();
	
	var html = '';
	
	navigator.geolocation.getCurrentPosition(function(position){
		html='<ul id="more_location_list" class="list-group">' +
		'<li class="list-group-item"><strong>Latitude: </strong>'+position.coords.latitude+'</li>' +
		'<li class="list-group-item"><strong>Longitude: </strong>'+position.coords.longitude+'</li>' +
		'<li class="list-group-item"><strong>Altitude: </strong>'+position.coords.altitude+'</li>' +
		'<li class="list-group-item"><strong>Accuracy: </strong>'+position.coords.accuracy+'</li>' +
		'</ul>';

	$('#more_location_display').html(html);
	
	});
}

// Get The Weather Info For a Location
function getWeather(city, state){
	console.log('Getting Weather For '+city+'...');

	var html = '';
	$.ajax({
		url:'http://api.wunderground.com/api/7572efe8c240e098/conditions/q/'+state+'/'+city+'.json',
		datatype:'jsonp',
		success: function(parsed_json){
			console.log(parsed_json.current_observation);

			weather = parsed_json['current_observation']['weather'];
			temperature_string = parsed_json['current_observation']['temperature_string'];
			icon_url = parsed_json['current_observation']['icon_url'];

			html = '<h1 class="text-center"><img src="'+icon_url+'"> '+weather+'</h1>' +
			'<h2 class="text-center">'+temperature_string+'</h2>';

			$('#weather').html(html);
		}
	});
}

// Clear extra info
function clearInfo(){
	getLocation();

	$('.navbar-toggle').click();

	$('#more_weather_display').html('');
	$('#more_location_display').html('');
}

// Get info about another location
function getOtherLocation(){
	var html = '';
	var city = $('#city').val();
	var state = $('#state').val();

	html = '<h1>'+city+', '+state+'</h1>';

	$('#myLocation').html(html);

	getWeather(city, state);
}