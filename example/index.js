/**
 * Created by liangyali on 14-12-12.
 */

var Sdk=require('../lib/sdk');


var settings = {
    baseUrl: 'http://127.0.0.1:8000'

};

var routes = {
    "user.get": {
        method: "DELETE",
        uri: "/user/list/:id"
    }};
var apis = new Sdk(settings, routes);

apis.use(function (options, done) {
    done(null, options);
});


//apis.preRequest(function (params, options) {
//    return {
//        data: {sign: 'test001'}
//    };
//});

apis.on('before', function (error, options) {
    console.log('before-----------');
    console.log(options);
});

apis.on('after', function (error, body) {
    console.log('after-----------');
    console.log(body);
});
apis.on('user.get:before', function (error, options) {
    console.log(options);
});

apis.on('user.get:after', function (error, body) {
    console.log(body);
});

var express = require('express');
var app = express();


app.delete('/user/list/:id', function (req, res) {
    var query = req.query;
    res.json({status: true, id: query});
});

app.listen(8000, function () {
    console.log('listened');

    apis.user.get({id: 1000, format: 'json', enable: true}, function (error, result) {
        console.log(error);
        console.log(result);

    });
});

