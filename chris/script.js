//Grabs Form
var userFormEl = document.getElementById('user-input');
//Grabs User Input City
var cityNameInputEl = document.getElementById('city-name');
//Grabs User Input Date
var userDateEl = document.getElementById('my-date-picker')
//Variable to access and display info out of localStorage
var savedCityAndDateArr = JSON.parse(localStorage.getItem('savedCityAndDate')) || [];
//Variables to grab list element to display user searches
var userSearchListTitle = document.getElementById('previous-searches');
userSearchListTitle.style.display = "none";
var userSearchList = document.getElementById('city-searches');
var events = document.getElementById('events');
var restaurants = document.getElementById('restaurants');
var entertainment = document.getElementById('entertainment');
var leisure = document.getElementById('leisure');
var sights = document.getElementById('sights');
var attractions = document.getElementById('attractions');
//Grabs ul title elements to display on button click
var searchResultsEl = document.getElementById('search-results');
searchResultsEl.style.display = "none";
var resultsTitle = document.getElementById('results-title');
var titleEvents = document.getElementById('city-events');
var titleRestaurants = document.getElementById('city-restaurants');
var titleEntertainment = document.getElementById('city-entertainment');
var titleLeisure = document.getElementById('city-leisure');
var titleSights = document.getElementById('city-sights');
var titleAttractions = document.getElementById('city-attractions');
//Grabs Modal and Button to close Modal
var modal = document.getElementById('my-modal');
var modalBtN = document.querySelector('.close');

//Function to take user input and call ticketmaster API "getEvents()" and geoapify APIs
var formSubmitHandler = function (event) {
    event.preventDefault();
    emptyList();
    savedCityAndDateArr = JSON.parse(localStorage.getItem('savedCityAndDate')) || [];
    var userDate = userDateEl.value.trim();
    var cityName = cityNameInputEl.value.trim();

    userSearchListTitle.style.display = "block";
    searchResultsEl.style.display = "block";
    resultsTitle.textContent = "Here's what's happening in " + cityName;
    titleEvents.textContent = "Events in " + cityName;
    titleRestaurants.textContent = "Restaurants in " + cityName;
    titleEntertainment.textContent = "Things to do in " + cityName;
    titleLeisure.textContent = "Leisure Activities in " + cityName;
    titleSights.textContent = "Things to See in " + cityName;
    titleAttractions.textContent = "Attractions in " + cityName;

    //Passes user input as argument to functions
    if (cityName&&userDate){
        getEvents(userDate,cityName);
        getCityID(cityName);
        saveCityAndDate();
    } else {
      modal.style.display = "block";
}};

//Function to convert user input into longitude and latitude which is necessary to search by category
var getCityID = function (city) {

    // Create a new promise and send geocoding request
    var promise = new Promise((resolve, reject) => {
      currentPromiseReject = reject;

      var apiKey = "9987ca1c87ef4586ad39eb0cfb2ef63e";
      var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(city)}&limit=1&apiKey=${apiKey}`;

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
        console.log(cityNameInputEl.value,'info...........',data);

        //Variables to store city longitude and latitude
        var lon = data.features[0].properties.lon;
        var lat = data.features[0].properties.lat;
        
        //Calls geoapify with lon and lat arguments
        getRestaurants(lon,lat);
        getTourismAttraction(lon,lat);
        getTourismSight(lon,lat);
        // getNatural(lon,lat);
        getLeisure(lon,lat);
        getEntertainment(lon,lat);

    }, (err) => {
      if (!err.canceled) {
        console.log(err);
      }
    });
};

//Gets City Events
var getEvents = function (date,city) {

  var ticketMasterURL = 'https://app.ticketmaster.com/discovery/v2/events?sort=random&apikey=35xNq6EDPwVNDTF6qYDV8EAALW4qm2rn&locale=*&startDateTime='+ date + 'T11:49:00Z&city='+ city + '&size=5';

fetch(ticketMasterURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log( city,'events',date,'........',data);
          for (var i=0; i<data._embedded.events.length; i++){
            var li = document.createElement('li')
            var cityResultsName = document.createElement('a');
            cityResultsName.textContent = data._embedded.events[i].name;
            var cityResultsURL = data._embedded.events[i].url;
            cityResultsName.setAttribute('href', cityResultsURL);
            li.append(cityResultsName);
            events.append(li);
          }
          
        }
        );
      } else {
        events.innerHTML = "No Results Found";
      }
    })
};

//Gets Restaurant recommendations based off proximity
var getRestaurants = function (lon,lat) {
    var requestOptions = {
        method: 'GET',
    };

    var geoapifyURL = 'https://api.geoapify.com/v2/places?categories=catering.restaurant&bias=proximity:'+ lon + ',' + lat +'&limit=5&apiKey=ce388ccf1ac54e96bd36e33be906821a';

    fetch(geoapifyURL, requestOptions)
    .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(cityNameInputEl.value,'restaurants.....',data);
             
            for (var i=0; i<data.features.length; i++){
              var cityResults = document.createElement('li');
              cityResults.textContent = data.features[i].properties.address_line1;
              var address = document.createElement('li');
              address.textContent = data.features[i].properties.address_line2;
              cityResults.append(address);
              restaurants.append(cityResults);
            }
          });
        } else {
          restaurants.innerHTML = "No Results Found";
        }
      });
        
};

//Gets Entertainment recommendations based off proximity
var getEntertainment = function (lon,lat) {
    var requestOptions = {
        method: 'GET',
    };

    var geoapifyURL = 'https://api.geoapify.com/v2/places?categories=entertainment&bias=proximity:'+ lon + ',' + lat +'&limit=5&apiKey=ce388ccf1ac54e96bd36e33be906821a';

    fetch(geoapifyURL, requestOptions)
    .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(cityNameInputEl.value,'entertainment.....',data);

            for (var i=0; i<data.features.length; i++){
              var cityResults = document.createElement('li')
              cityResults.textContent = data.features[i].properties.name;
              var address = document.createElement('li');
              address.textContent = data.features[i].properties.address_line2;
              cityResults.append(address);
              entertainment.append(cityResults);
            }
          });
        } else {
          entertainment.innerHTML = "No Results Found";
        }
      });
        
};

//Gets Leisure recommendations based off proximity
var getLeisure = function (lon,lat) {
    var requestOptions = {
        method: 'GET',
    };

    var geoapifyURL = 'https://api.geoapify.com/v2/places?categories=leisure&bias=proximity:'+ lon + ',' + lat +'&limit=5&apiKey=ce388ccf1ac54e96bd36e33be906821a';

    fetch(geoapifyURL, requestOptions)
    .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(cityNameInputEl.value,'leisure.....',data);

            for (var i=0; i<data.features.length; i++){
              var cityResults = document.createElement('li');
              cityResults.textContent = data.features[i].properties.address_line1;
              var address = document.createElement('li');
              address.textContent = data.features[i].properties.address_line2;
              cityResults.append(address);
              leisure.append(cityResults);
            }
          });
        } else {
          leisure.innerHTML = "No Results Found";
        }
      });
        
};

//Gets Nature recommendations based off proximity
// var getNatural = function (lon,lat) {
//     var requestOptions = {
//         method: 'GET',
//     };

//     var geoapifyURL = 'https://api.geoapify.com/v2/places?categories=natural&bias=proximity:'+ lon + ',' + lat +'&limit=5&apiKey=ce388ccf1ac54e96bd36e33be906821a';

//     fetch(geoapifyURL, requestOptions)
//     .then(function (response) {
//         if (response.ok) {
//           response.json().then(function (data) {
//             console.log(cityNameInputEl.value,'natural.....',data);
//             for (var i=0; i<data.features.length; i++){
//               var cityResults = data.features[i].properties.address_line1;
//               cityResults.textContent = document.createElement('a');
//               displayResults.append(cityResults);
//             }
//           });
//         } else {
//           alert('Error: ' + response.statusText);
//         }
//       });
        
// };

//Gets Tourism sights recommendations based off proximity
var getTourismSight = function (lon,lat) {
    var requestOptions = {
        method: 'GET',
    };

    var geoapifyURL = 'https://api.geoapify.com/v2/places?categories=tourism.sights&bias=proximity:'+ lon + ',' + lat +'&limit=5&apiKey=ce388ccf1ac54e96bd36e33be906821a';

    fetch(geoapifyURL, requestOptions)
    .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(cityNameInputEl.value,'tourism sights.....',data);
            for (var i=0; i<data.features.length; i++){
              var cityResults = document.createElement('li');
              cityResults.textContent = data.features[i].properties.address_line1;
              var address = document.createElement('li');
              address.textContent = data.features[i].properties.address_line2;
              cityResults.append(address);
              sights.append(cityResults);
            }
          });
        } else {
          sights.innerHTML = "No Results Found";
        }
      });
        
};

//Gets Tourism Attraction recommendations based off proximity
var getTourismAttraction = function (lon,lat) {
    var requestOptions = {
        method: 'GET',
    };

    var geoapifyURL = 'https://api.geoapify.com/v2/places?categories=tourism.attraction&bias=proximity:'+ lon + ',' + lat +'&limit=5&apiKey=ce388ccf1ac54e96bd36e33be906821a';

    fetch(geoapifyURL, requestOptions)
    .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(cityNameInputEl.value,'tourism attraction.....',data);
            for (var i=0; i<data.features.length; i++){
              var cityResults = document.createElement('li');
              cityResults.textContent =  data.features[i].properties.address_line1;
              var address = document.createElement('li');
              address.textContent = data.features[i].properties.address_line2;
              cityResults.append(address)
              attractions.append(cityResults);
            }
          });
        } else {
          attractions.innerHTML = "No Results Found";
        }
      });
        
};

//Saves User Searches and Displays them using list elements
function saveCityAndDate(){

  var savedCityAndDate = cityNameInputEl.value + ", " + userDateEl.value;
  savedCityAndDateArr.push(savedCityAndDate);
  localStorage.setItem('savedCityAndDate',JSON.stringify(savedCityAndDateArr));

  for(var i=0; i<savedCityAndDateArr.length; i++){
      var userSearch = document.createElement('li');
      userSearch.textContent = savedCityAndDateArr[i];
      console.log(userSearch)
      userSearchList.prepend(userSearch);
  };
};

//Clears previous search results
function emptyList () {
userSearchList.innerHTML = "";
events.innerHTML = "";
restaurants.innerHTML = "";
entertainment.innerHTML = "";
leisure.innerHTML = "";
sights.innerHTML = "";
attractions.innerHTML = "";
};


//Closes Modal on click
modalBtN.onclick = function closeModal (){
modal.style.display = "none";
};

userFormEl.addEventListener('submit', formSubmitHandler);
// Featured Cities
//Phx, Houston, Las Vegas Miami, New York, Yellowstone

