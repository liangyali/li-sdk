/*
 *
 * http://liangyali.com
 *
 * Copyright (c) 2014 liangyali
 * Licensed under the MIT license.
 */

"use strict";

var events = require('events');
var util = require('util');
var _ = require('lodash');
var request = require('request');
var async = require('async');

/**
 * sdk constructor
 * @param baseUrl base url of api
 * @param routes  routes of api
 * @param settings the options of api
 * @constructor
 */
function Sdk(settings, routes) {

    this._settings = settings || {};
    this._baseUrl = settings.baseUrl || '';
    this._routes = routes || [];
    this._handlers = [];

    events.EventEmitter.call(this);
    this._initRoutes();
}

util.inherits(Sdk, events.EventEmitter);

/**
 * init Routes
 * @private
 */
Sdk.prototype._initRoutes = function () {
    var self = this;
    var routes = self._routes;

    Object.keys(routes).forEach(function (key) {
        var route = routes[key];
        var spaces = key.split('.');

        var context = self;
        spaces.forEach(function (space) {
            context[space] = (context[space] === undefined) ? self._handler(key, route, self._baseUrl) : context[space];
            context = context[space];
        });
    });
};

/**
 * handler the api interface
 * @param route
 * @param baseUrl
 * @private
 */
Sdk.prototype._handler = function (name, route, baseUrl) {

    var self = this;
    return function (params, callback) {

        callback = callback || route.callback;

        /**
         * http method (default: "GET")
         * @type {*|string}
         */
        route.method = route.method || 'GET';

        /**
         * params default {}
         * @type {*|{}}
         */
        params = params || {};

        /**
         * 'HEAD', 'GET', 'DELETE'
         * if route contains ':' to process route url
         * example:/users/:id
         */
        var qsOrBody = _.clone(params);

        route.uri = (route.uri || '').replace(/:(\w+)/g, function (all, name) {
            var result = qsOrBody[name] || all;
            delete qsOrBody[name];
            return result;
        });

        var requestOptions = {
            uri: baseUrl + route.uri,
            json: true,
            method: route.method
        };

        switch (route.method.toUpperCase()) {
            case 'PATCH':
            case 'POST':
            case 'PUT':
                requestOptions.body = qsOrBody;
                break;
            default :
                requestOptions.qs = qsOrBody;
                break;
        }

        var processRequestCallback = function (error, response, body) {
            self.emit('after', error, body);
            self.emit(name + ':after', error, body);
            if (error) {
                self.emit('error', error);
                return callback(error);
            }

            return callback(null, body);
        };

        var processRequest = function (error, options) {
            self.emit('before', error, options);
            self.emit(name + ':before', error, options);

            if (error) {
                return processRequestCallback(error);
            }
            request(options.requestOptions, processRequestCallback);
        };

        var steps = _.union([function (callback) {
            callback(null, {params: params, requestOptions: requestOptions, settings: self._settings, api: name});
        }], self._handlers);

        async.waterfall(steps, processRequest);
    };
};

/**
 * 设置中间件
 * @param handler Function(options,next)
 * options:{params:params,options:options api:api}
 * @api public
 */
Sdk.prototype.use = function (handler) {
    if (!_.isFunction(handler)) {
        throw new Error('use argument must be Function');
    }
    this._handlers.push(handler);
};

module.exports = Sdk;

