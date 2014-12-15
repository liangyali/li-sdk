/**
 * Created by liangyali on 14-12-12.
 */

var Sdk = require('../lib/sdk');

var settings = {
    baseUrl: 'http://127.0.0.1:8000'

};

var routes = {
    "user.get": {
        method: "DELETE",
        uri: "/user/list/:id.:format/:enable"
    },
    "user.search": {
        method: "DELETE",
        uri: "/user/search"
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

app.delete('/user/search', function (req, res) {
    res.status(404).send({status: false});
});

api.use(function (options, next) {
    return next(new Error('hello'), options);
});


app.listen(8000, function () {

    api.user.get({id: 1000, format: 'json', enable: true, tag: 'test'})
        .then(function (body) {
            console.log(body);
        }).catch(function (e) {
            console.log(e);
        });
});





