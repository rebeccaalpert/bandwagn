var express = require('express');

// Required if we need to use HTTP query or post parameters
var bodyParser = require('body-parser');
var validator = require('validator'); // See documentation at https://github.com/chriso/validator.js
var app = express();
// See https://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
app.use(bodyParser.json());
// See https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
app.use(bodyParser.urlencoded({ extended: true }));

// Mongo initialization and connect to database
// process.env.MONGOLAB_URI is the environment variable on Heroku for the MongoLab add-on
// process.env.MONGOHQ_URL is the environment variable on Heroku for the MongoHQ add-on
// If environment variables not found, fall back to mongodb://localhost/nodemongoexample
// nodemongoexample is the name of the database
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/bandwagn';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

// Serve static content
app.use(express.static(__dirname + '/public'));

// serve static html files in public directory
app.use(express.static(__dirname + '/public'));

function isValid(lat, lng) {
	if (validator.isNull(lat) || validator.isNull(lng)) {
		return false;
	} else {
		return true;
	}
}

app.post('/addLocation', function(request, response) {
	// enable CORS
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "X-Requested-With");

	var lat = parseFloat(request.body.lat);
	var lng = parseFloat(request.body.lng);

	if (isValid(lat, lng)) {
		// set up new column
		var toInsert = {
		"lat": lat,
		"lng": lng,
		};	

		db.collection('locations', function(error, coll) {
			var id = coll.insert(toInsert, function(error, saved) {
				if (error) {
					response.send(500, "Error" + error);
				}
				else { // successfully inserted
					response.send(200);
				}
			});
		});
	} else {
		response.send({"error":"Whoops, something is wrong with your data!"});
	}
});

// send location API
// Returns a JSON string. Submits check-in from any domain.
// The mandatory fields and exact field names for submission to this API are lat and lng
// Successful submission of these two pieces of data shall return a JSON string that is an array of objects.
app.get('/getRandomLocation', function(request, response) {
	// enable CORS
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "X-Requested-With");

	db.collection('locations', function(error, collection) {
		if (!error) {
			collection.find().toArray(function(error, cursor) {
				if (!error) {
					var randomIndex = getRandomInt(0, cursor.length);
					var randomLocation = '{"lat": ' + cursor[randomIndex].lat + ', "lng": ' + cursor[randomIndex].lng + '}';
					response.send(randomLocation); // send a random value
				}
			});
		} else {
		response.send({"error":"Whoops, something is wrong with your data!"});
		}
	});
});

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Accessing this on a web browser shall display list of users sorted in descending order by timestamp
app.get('/locations', function(request, response) {
  	response.set('Content-Type', 'text/html');
	var page = '';
	db.collection('locations', function(error, collection) {
		collection.find().sort( { created_at: -1 } ).toArray(function(error, cursor) {
			if (!error) {
				page += '<!DOCTYPE HTML><html><head><title>Locations</title><meta name="viewport" content="width=device-width" /></head><body><h1>Users</h1>';
				for (var count = 0; count < cursor.length; count++) {
					page += "<div><p>" + cursor[count].locale + "</p></div>";
				}
				userPage += "</body></html>"
				response.send(page);
			} else {
				response.send('<!DOCTYPE HTML><html><head><title>Locations</title><meta name="viewport" content="width=device-width" /></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>');
			}
		});
	});
});

app.get('/', function(request, response) {
	response.sendFile(__dirname + '/public/indextest.html');
});

app.listen(process.env.PORT || 5000);