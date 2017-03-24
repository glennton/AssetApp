    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    
    // configuration =================

    var options = { server: { socketOptions: { keepAlive: 30000, connectTimeoutMS: 3000 } }, 
                    replset: { socketOptions: { keepAlive: 30000, connectTimeoutMS : 3000} } };       
     
    var mongodbUri = 'mongodb://jabuser:jabtest@ds139470.mlab.com:39470/jabtest';
    mongoose.connect(mongodbUri, options);

    var conn = mongoose.connection;             
    conn.on('error', console.error.bind(console, 'connection error:'));  
    conn.once('open', function() {

    });

    var mongoSchema = mongoose.Schema;
    var siteAssetSchema = new mongoSchema({
        "siteAssets":Array
    })

    var dbSchema = {
        "siteAssets":mongoose.model('siteAssets',siteAssetSchema)
    }

    app.use(express.static(__dirname + '/public/dist'));                 // set the static files location /public/img will be /img for users
    app.use('/bower_components',  express.static(__dirname + '/bower_components'));
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
    app.use('/scripts/', express.static(__dirname + '/node_modules/'));

    // listen (start app with node server.js) ======================================
    // define model =================
    var mongoCreateInst = dbSchema.siteAssets;

    app.listen(3000);

    console.log("App listening on port 3000");


// routes ======================================================================
    // api ---------------------------------------------------------------------
    // get all allSiteData
    /*app.get('/api/siteAssets', function(req, res) {

        // use mongoose to get all allSiteData in the database
        siteData.find(function(err, allSiteData) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err){
                res.send(err)
            }

            res.json(allSiteData); // return all allSiteData in JSON format
        });
    });
*/

    // create siteData and send back all allSiteData after creation
    app.post('/api/siteAssets', function(req, res, next) {
        // create a siteData, information comes from AJAX request from Angular
        var reqData = mongoCreateInst(req);

        console.log('req=' + reqData)
        reqData.save([req], function(err, todo) {
            if (err){
                res.send(err);
            }

            // get and return all the allSiteData after you create another
            /*siteData.find(function(err, allSiteData) {
                if (err){
                    res.send(err)
                }
                res.json(allSiteData);
            });*/
        });
    });


