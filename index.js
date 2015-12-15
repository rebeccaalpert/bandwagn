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

function isValid(name, lat, lng) {
	if (validator.isNull(name) || validator.isNull(lat) || validator.isNull(lng)) {
		return false;
	} else {
		return true;
	}
}

function notInDB(lat, lng) {
	db.collection('locations', function(error, collection) {
		if (!error) {
			if (collection.find.count() > 0) {
				return false;
			} else {
				return true;
			}
		}
	});
}

app.post('/sendLocation', function(request, response) {
	var name = toString(request.body.name);
	name = escape(name);
	var lat = parseFloat(request.body.lat);
	var lng = parseFloat(request.body.lng);

	if (isValid(name, lat, lng) && notInDB(lat, lng)) {
		var toInsert = {
			"name": name,
			"lat": lat,
			"lng": lng,
		};	

		db.collection('locations', function(error, coll) {
			var id = coll.insert(toInsert, function(error, saved) {
				if (error) {
					response.send(500);
				}
				else {
					coll.find().toArray(function(err, items) {
						if (!err) {
							response.send(200);
						} else {
							response.send(500);
						}
					});
				}
			});
		});
	} else {
		response.send(500);
	}
});

// returns a random location from the database in the format: {"lat": 40.74838, "lng": -73.996705}
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
			response.send({"error":"Whoops, something is wrong with our data!"});
		}
	});
});

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

app.get('/', function(request, response) {
	response.sendFile(__dirname + '/public/indextest.html');
});

app.listen(process.env.PORT || 5000);