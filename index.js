"user strict"

var express = require('express');
var config = require('./config');
var exphbs = require('express-handlebars');
var computations = require('./computations');

var app = express();
app.engine('.hbs', exphbs({defaultLayout: 'main',  extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(express.static('assets'));

app.get('/', function(req, res) {

    Promise.all([computations.runTest(config.url1, config.sampleSize),
        computations.runTest(config.url2, config.sampleSize)]).then(function(resultArray) {
        const result = {
            sample1: resultArray[0],
            sample1TTFBMean: computations.getMean(resultArray[0], config.sampleSize),
            sample1Url: config.url1,
            sample1Requests: resultArray[0][0].requests,
            sample2: resultArray[1],
            sample2TTFBMean: computations.getMean(resultArray[1], config.sampleSize),
            sample2Url: config.url2,
            sample2Requests: resultArray[1][0].requests
        }
        console.log("result", result);
        res.render('home', result)
    }).catch(function(err) {
        console.log("error ", err);
    });
});

app.listen(3000, function () {
    console.log('running app!');
});
