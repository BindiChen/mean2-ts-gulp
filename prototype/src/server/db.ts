var MongoDb       = require('mongodb');
var Async         = require('async');

var config        = require('../../config.json');
var dbconfig      = config.database.mongo;

////////////////////
// Database setup //
////////////////////
var dbaddress = 'mongodb://';
if (dbconfig.user)
    dbaddress += dbconfig.user + ":" + dbconfig.password + "@";
dbaddress += dbconfig.server + ':' + dbconfig.port + '/' + dbconfig.database;

var _nextUserId = undefined;
var _connected = false;

exports.connected = function (done) {return _connected;}
// In memory, to work out the next id for user
exports.nextUserid = function (done) {return _nextUserId++;}

////////////////////////////////
// Method to connect database //
////////////////////////////////
exports.connect = function (done) {

    if (_connected) return done();

    MongoDb.MongoClient.connect(dbaddress, function (err, db){
        exports.db = db;
        exports.collections = {};
        _connected = true; // Indicate the connected status


        var tasks = [];


        // Adding proper collection to db.collections object 
        tasks.push(function(doneCollection) {
            db.createCollection('users', {strict: false}, function (err, collection) {
                exports.collections['users'] = collection;
                doneCollection(err);
            });
        });

        // Get the max uid
        tasks.push(function(doneCollection) {
            var aggregation = { $group: { _id: {}, maxTC: {$max: "$userId"}} };
            exports.collections.users.aggregate(aggregation, function(err, user){
                if (err) return doneCollection(err);
                if (user.length === 1)
                    _nextUserId = user[0].maxTC + 1;
                else
                    _nextUserId = 1;
                doneCollection();
            }); 
        });
        

        // Run all tasks in series
        Async.series(tasks, function(err) {
            return done(err);
        });

    });
}

exports.stop = function (done) {
    _connected = false;
    exports.db.close(done);
}