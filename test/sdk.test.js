"use strict";
var SDK = require('../lib/sdk');
require('should');

function create() {
    var options = {
        baseUrl: 'http://127.0.0.1:3000',
        request: function (options, callback) {
            if (options.uri === 'http://127.0.0.1:3000/product/get') {
                return callback(new Error('error'));
            }
            callback(null, {}, {status: true});
        }
    };

    var routes = {
        "product.search": {
            method: 'GET',
            uri: '/product/search'
        },
        "product.search.create": {
            method: 'POST',
            uri: '/product/search'
        },
        "product.get": {
            method: 'GET',
            uri: '/product/get'
        }
    };

    return new SDK(options, routes);
}

var noop = function () {
};

describe('#sdk', function () {

    describe('#use', function () {
        it('测试中间件运行', function (done) {
            var api = create();

            api.use(function (options, next) {
                return next(new Error('abort'), options);
            });

            api.product.search({id: 100}).then(noop, function () {
                done();
            });
        });

        it('type throw exception', function () {
            var api = create();
            (function () {
                api.use(1);
            }).should.throw();
        });

        it('测试中间件运行,中间件抛出异常', function (done) {
            var api = create();

            api.use(function (options, next) {
                return next(new Error('abort'), options);
            });

            api.product.search({id: 100})
                .then(noop, function () {
                    done();
                });
        });

        it('测试中间件运行,测试中间件设置值', function (done) {
            var api = create();

            api.use(function (options, next) {
                options.tag = 'tag';
                return next(null, options);
            });

            api.use(function (options, next) {
                options.tag.should.be.equal('tag');
                return next(null, options);
            });

            api.product.search({id: 100})
                .then(function () {
                    done();
                });
        });
    });

    describe('#event:before', function (done) {
        it('before should be invoke', function (done) {
            var api = create();

            api.use(function (options, next) {
                options['_id'] = '_id';
                return next(new Error('abort'), options);
            });

            api.on('before', function (error, options) {

                options['_id'].should.be.ok;

            });

            api.product.search({id: 100}).then(noop, function () {
                done();
            });
        });

        it('{apiname}:before should be invoke', function (done) {
            var api = create();

            api.use(function (options, next) {
                options['_id'] = '_id';
                return next(new Error('abort'), options);
            });

            api.on('product.search:before', function (error, options) {
                options['_id'].should.be.ok;
            });

            api.product.search({id: 100}).then(noop, function () {
                done();
            });
        });
    });


    describe('#after', function () {
        it('should be invoke after', function (done) {
            var api = create();

            api.on('after', function (error, body) {
                body.status.should.be.true;
            });

            api.product.search({id: 100}).then(function () {
                done();
            }, noop);
        });

        it('should be invoke product.search:after', function (done) {
            var api = create();

            api.on('product.search:after', function (error, body) {
                body.status.should.be.true;
            });

            api.product.search({id: 100}).then(function () {
                done();
            }, noop);
        });

        it('should invoke product.search and result status true', function (done) {
            var api = create();

            api.product.search({id: 100}, function (error, body) {
                done(body.status ? null : new Error());
            });

            api.product.search({id: 100}).then(function (value) {
                value.status.should.be.true;
                done();
            }, noop);
        });


    });

    describe('#request ', function () {
        it('should invoke products.search and result has  error', function (done) {
            var api = create();

            api.use(function (options, next) {
                next(new Error(), null);
            });

            api.product.search({id: 100}).then(noop, function (value) {
                done();
            });
        });

        it('products.search.create', function (done) {
            var api = create();

            api.product.search({id: 100}).then(function () {
                done();
            }, noop);
        });
    });

    describe('#error ', function () {
        it('error event', function (done) {
            var api = create();


            api.on('error', function (error, options) {
                done();
            });

            api.product.get({id: 100, p: 110}).then();
        });
    });
});
