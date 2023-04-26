var userFormEl = document.getElementById('user-city');
var cityNameInputEl = document.getElementById('city-name');

var formSubmitHandler = function (event) {
    event.preventDefault();

    var cityName = cityNameInputEl.value.trim();

    if (cityName){
        getRestaurants(cityName);
        getEvents(cityName);
        // getAttractions(cityName)
    } else {
        alert('Please enter a City')
    }
}

var getRestaurants = function (city) {

    /* Create a new promise and send geocoding request */
    var promise = new Promise((resolve, reject) => {
      currentPromiseReject = reject;

      var apiKey = "9987ca1c87ef4586ad39eb0cfb2ef63e";
      var url = `https://api.geoapify.com/v1/geocode/autocomplete?features=radius_100.restauranttext=${encodeURIComponent(city)}&limit=5&apiKey=${apiKey}`;

      fetch(url)
        .then(response => {
          // check if the call was successful
          console.log(response)
          if (response.ok) {
            response.json().then(data => resolve(data));
          } else {
            response.json().then(data => reject(data));
          }
        });
    });

    promise.then((data) => {
        // we will process data here
        console.log(data)

    }, (err) => {
      if (!err.canceled) {
        console.log(err);
      }
    });
};
    

userFormEl.addEventListener('submit', formSubmitHandler);

var getEvents = function (city) {

var ticketMasterURL = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=35xNq6EDPwVNDTF6qYDV8EAALW4qm2rn';

fetch(ticketMasterURL)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Please Enter a City');
    });
};