/**
* Created by liangyali on 14-12-12.
*/

var Sdk = require('../lib/sdk');
var co = require('co');


var settings = {
    baseUrl: 'http://127.0.0.1:8000'

};

var routes = {
    "user.get": {
        method: "DELETE",
        uri: "/user/list/:id.:format/:enable"
    }};
var api = new Sdk(settings, routes);

api.use(function (options, done) {
    done(null, options);
});


//api.preRequest(function (params, options) {
//    return {
//        data: {sign: 'test001'}
//    };
//});

//api.on('before', function (error, options) {
//    console.log('before-----------');
//    console.log(options);
//});
//
//api.on('after', function (error, body) {
//    console.log('after-----------');
//    console.log(body);
//});
//api.on('user.get:before', function (error, options) {
//    console.log(options);
//});
//
//api.on('user.get:after', function (error, body) {
//    console.log(body);
//});

var express = require('express');
var app = express();


app.delete('/user/list/:id/:enable', function (req, res) {
    var query = req.query;
    console.log(req.url);
    res.json(query);
});

var Promise = require('promise');

app.listen(8000, function () {

    Promise.all([
        api.user.get({id: 1000, format: 'json', enable: true, tag: 'test'}),
        api.user.get({id: 2000, format: 'xml', enable: false}),
        api.user.get({id: 3000, format: 'js', enable: true})
    ]).then(function (body) {
        console.log(body);
    }, function (error) {
        console.log(error);
    });

    var p=api.user.get({id: 1000, format: 'json00', enable: true, tag: 'test'});

    p.then(function(value){
        console.log(value);
    });

    p.then(function(value){
        console.log(value);
    });
    p.then(function(value){
        console.log(value);
    });
});




