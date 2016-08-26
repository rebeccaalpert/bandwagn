# Bandwagn

Hear music by artists near your geographic location. Explore other cities and see where you've been!

Bandwagn was my final project for Comp 20, Web Programming, in fall 2015 at Tufts University.

Bandwagn was available at [bandwagn.herokuapp.com](http://bandwagn.herokuapp.com/), but ceased operation on May 31, 2016, when support for the Echo Nest API was discontinued and Echo Nest shifted focus to the Spotify API. The Spotify API currently does not allow developers to search for artists by location, the key piece that made Bandwagn possible.

The application requested the user's location, identified tracks by artists from near the user's location, and selected a track for the user to listen to via Spotify's play button. Users could then "spin the wheel" to listen to tracks by artists from other cities, served by the application database. Cities "visited" by the user were displayed on a chart of the U.S. A Spotify account was required to use the site.

**Features**
* Geolocation: The application detected the user's location and found a song by an artist based nearby.
* Front-end framework: The site ran on Bootstrap.
* Charts: The site showed a map of the cities the user had "visited," powered by Google charts.
* Client-side data persistence with local storage: The site stored where the user had been via local storage and used it to display points on the map.
* Server-side data persistence: The site was backed by a database of locations, which served the client random latitudes and longitudes when they explored new locations.

**Data**
* Songs by artists near geographic location (Echonest)
* Music player (Spotify)
* MongoDB database of U.S. cities (derived from [U.S. Cities Data](http://simplemaps.com/resources/us-cities-data))

**Algorithms or Special Techniques**

Serve random latitudes and longitudes from the database. Derive city and state from Google reverse coder.

**APIs**
* EchoNest API
* Spotify Play Button
* Google Reverse Geocoding API
* Google Charts API

References:
* [Lovely MongoDB reference](https://scotch.io/tutorials/an-introduction-to-mongodb)
* [Parsing floats](http://www.w3schools.com/jsref/jsref_parsefloat.asp)
* [Working with Echonest API and artist location](https://github.com/plamere/en-demos/blob/master/location/artist_location.html)
* [Ming's Geolocation map example](https://github.com/tuftsdev/WebProgramming/blob/gh-pages/examples/google_maps/geolocation_map.html)
* [Reverse Geocoding with Google Maps API](https://developers.google.com/maps/documentation/javascript/geocoding#reverse-geocoding-by-location)
* [Getting only the city and state from Google's reverse geocoding results](http://www.raymondcamden.com/2013/03/05/Simple-Reverse-Geocoding-Example)
* [Select multiple buckets using .getJSON](https://developer.echonest.com/forums/thread/1482)
* [Math.random function for range](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
* [Google Geochart](https://developers.google.com/chart/interactive/docs/gallery/geochart?hl=en)
* [Google DataTables](https://developers.google.com/chart/interactive/docs/reference?hl=en)
