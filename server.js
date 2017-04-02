    var express  = require('express');
    var assert = require('assert');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    
    // configuration =================
    
    app.use(express.static(__dirname + '/public/dist'));                 // set the static files location /public/img will be /img for users
    app.use('/bower_components',  express.static(__dirname + '/bower_components'));
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
    app.use('/scripts/', express.static(__dirname + '/node_modules/'));

    mongoose.connect('mongodb://jabuser:jabtest@ds139470.mlab.com:39470/jabtest')
    var db = mongoose.connection;    

    var Schema = mongoose.Schema;

    var siteAssetSchema = new Schema({
        "url"               : String,
        "date"              : String,
        "day"               : String,
        "month"             : String,
        "year"              : String,
        "endDate"           : String,
        "endDay"            : String,
        "endMonth"          : String,
        "endYear"           : String,
        "type"              : String,
        "uuid"              : String,
        "notes"             : String,
        "homepageModules"   : Array,
        "flyouts"           : Array,
        "globalAs"          : Array,
        "globalCs"          : Array

    })

    var siteAsset = mongoose.model('siteAsset', siteAssetSchema)

    //CREATE NEW
    app.post('/api/siteAssets/create', function(req, res){
        var siteAssetData = siteAsset(req.body)
        siteAssetData.save(function(err){
            if (!assert.equal(null, err)) {
                res.status(200);
                res.json({
                    "status": 200,
                    "message": "success"
                });
                console.log('success');
            } else{
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "error"
                });
                console.log('failure = ',+err);
            }
        })
    }) 

    //UPDATE
    app.post('/api/siteAssets/update', function(req, res){
        var siteAssetData = siteAsset(req.body)

     siteAssetData.update(req.body,{upsert: true},function(err){
            if (!assert.equal(null, err)) {
                res.status(200);
                res.json({
                    "status": 200,
                    "message": "success"
                });
                console.log('success');
            } else{
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "error"
                });
                console.log('failure = ',+err);
            }
        })

    })

    //GET
    app.get('/api/siteAssets', function(req, res) {
        if(req.query._id == null && req.query.url == null){
            siteAsset.find(function(err, siteAssets){
                res.json(siteAssets)
                //console.log('null')
            })
        }
        if(req.query._id != null){
            siteAsset.findOne({_id:req.query._id}, function(err, siteAssets){
                res.json(siteAssets)
                //console.log('_id')
            })
        }
        if(req.query.url != null){
            siteAsset.findOne({url:req.query.url}, function(err, siteAssets){
                res.json(siteAssets)
                //console.log('url')
            })
        }
    });



    // listen (start app with node server.js) ======================================
    // define model =================

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
  





/*

    // create siteData and send back all allSiteData after creation
    app.post('/api/siteAssets', function(req, res) {
        // create a siteData, information comes from AJAX request from Angular
        console.log('req=' + req.body);
        var reqData = mongoCreateInst(req.body);
        console.log('reqafter=' + reqData)
        reqData.save([req], function(err, result) {
            if (!assert.equal(null, err)) {
                res.status(200);
                res.json({
                    "status": 200,
                    "message": "success"
                });
                console.log('success');
            } else{
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "error"
                });
                console.log('failure = ',+err);
            }
        });
    });

*/
