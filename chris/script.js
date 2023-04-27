//Grabs Form
var userFormEl = document.getElementById('user-city');
//Grabs User Input City
var cityNameInputEl = document.getElementById('city-name');
//Grabs User Input Date
var userDateEl = document.getElementById('event-date')

//Function to take user input and call ticketmaster API "getEvents()" and geoapify APIs
var formSubmitHandler = function (event) {
    event.preventDefault();

    var cityName = cityNameInputEl.value.trim();
    var userDate = userDateEl.value.trim();
    console.log(userDate)

    //Passes user input as argument to functions
    if (cityName){
        getEvents(cityName,userDate);
        getCityID(cityName);
    } else {
        alert('Please enter a City')
    }
}

//Function to convert user input into longitude and latitude which is necessary to search by category
var getCityID = function (city) {

    // Create a new promise and send geocoding request
    var promise = new Promise((resolve, reject) => {
      currentPromiseReject = reject;

      var apiKey = "9987ca1c87ef4586ad39eb0cfb2ef63e";
      var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(city)}&limit=5&apiKey=${apiKey}`;

      fetch(url)
        .then(response => {
          // check if the call was successful
          if (response.ok) {
            response.json().then(data => resolve(data));
          } else {
            response.json().then(data => reject(data));
          }
        });
    });

    promise.then((data) => {
        // we will process data here
        console.log('city...........',data);

        //Variables to store city longitude and latitude
        var lon = data.features[0].properties.lon;
        var lat = data.features[0].properties.lat;
        
        //Calls geoapify with lon and lat arguments
        // getRestaurants(lon,lat);
        // getTourismAttraction(lon,lat);
        // getTourismSight(lon,lat);
        // getNatural(lon,lat);
        // getLeisure(lon,lat);
        // getEntertainment(lon,lat);

    }, (err) => {
      if (!err.canceled) {
        console.log(err);
      }
    });
};

//Gets City Events
var getEvents = function (city,date) {

var ticketMasterURL = 'https://app.ticketmaster.com/discovery/v2/events.json?city=' + city + '&localStartDateTime=121123&apikey=35xNq6EDPwVNDTF6qYDV8EAALW4qm2rn';

fetch(ticketMasterURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log('events........',data);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
};

//Gets Restaurant recommendations based off proximity
var getRestaurants = function (lon,lat) {
    var requestOptions = {
        method: 'GET',
    };

    var geoapifyURL = 'https://api.geoapify.com/v2/places?categories=catering.restaurant&bias=proximity:'+ lon + ',' + lat +'&apiKey=ce388ccf1ac54e96bd36e33be906821a';

    fetch(geoapifyURL, requestOptions)
    .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log('restaurants.....',data);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      });
        
};

//Gets Entertainment recommendations based off proximity
var getEntertainment = function (lon,lat) {
    var requestOptions = {
        method: 'GET',
    };

    var geoapifyURL = 'https://api.geoapify.com/v2/places?categories=entertainment&bias=proximity:'+ lon + ',' + lat +'&apiKey=ce388ccf1ac54e96bd36e33be906821a';

    fetch(geoapifyURL, requestOptions)
    .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log('entertainment.....',data);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      });
        
};

//Gets Leisure recommendations based off proximity
var getLeisure = function (lon,lat) {
    var requestOptions = {
        method: 'GET',
    };

    var geoapifyURL = 'https://api.geoapify.com/v2/places?categories=leisure&bias=proximity:'+ lon + ',' + lat +'&apiKey=ce388ccf1ac54e96bd36e33be906821a';

    fetch(geoapifyURL, requestOptions)
    .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log('leisure.....',data);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      });
        
};

//Gets Nature recommendations based off proximity
var getNatural = function (lon,lat) {
    var requestOptions = {
        method: 'GET',
    };

    var geoapifyURL = 'https://api.geoapify.com/v2/places?categories=natural&bias=proximity:'+ lon + ',' + lat +'&apiKey=ce388ccf1ac54e96bd36e33be906821a';

    fetch(geoapifyURL, requestOptions)
    .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log('natural.....',data);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      });
        
};

//Gets Tourism sights recommendations based off proximity
var getTourismSight = function (lon,lat) {
    var requestOptions = {
        method: 'GET',
    };

    var geoapifyURL = 'https://api.geoapify.com/v2/places?categories=tourism.sights&bias=proximity:'+ lon + ',' + lat +'&apiKey=ce388ccf1ac54e96bd36e33be906821a';

    fetch(geoapifyURL, requestOptions)
    .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log('tourism sights.....',data);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      });
        
};

//Gets Tourism Attraction recommendations based off proximity
var getTourismAttraction = function (lon,lat) {
    var requestOptions = {
        method: 'GET',
    };

    var geoapifyURL = 'https://api.geoapify.com/v2/places?categories=tourism.attraction&bias=proximity:'+ lon + ',' + lat +'&apiKey=ce388ccf1ac54e96bd36e33be906821a';

    fetch(geoapifyURL, requestOptions)
    .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log('tourism attraction.....',data);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      });
        
};
userFormEl.addEventListener('submit', formSubmitHandler);