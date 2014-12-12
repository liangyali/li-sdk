"use strict";
var SDK = require('../lib/sdk');

function create() {
    var options = {
        baseUrl: 'http://127.0.0.1:3000',
        request: function (options, callback) {
            callback(null, {}, {status: true});
        }
    };

    var routes = {
        "products.search": {
            method: 'GET',
            uri: '/products/search'
        },
        "products.get": {
            method: 'GET',
            uri: '/products/:id'
        }
    };

    return new SDK(options, routes);
}

describe('#sdk', function () {

    describe('#use', function () {
        it('测试中间件运行', function (done) {
            var api = create();

            api.use(function (options, next) {
                return next(new Error('abort'), options);
            });

            api.products.search({id: 100}, function (error, body) {
                done();
            });
        });

        it('测试中间件运行,中间件抛出异常', function (done) {
            var api = create();

            api.use(function (options, next) {
                return next(new Error('abort'), options);
            });

            api.products.search({id: 100}, function (error, body) {
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
                var error = null;

                if (options.tag) {
                    error = new Error('tag');
                } else {
                    error = new Error('not tag');
                }
                return next(error, options);
            });

            api.products.search({id: 100}, function (error, body) {
                if (error.message === 'tag') {
                    done();
                } else {
                    done(new Error());
                }
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
                if (options['_id']) {
                    done();
                } else {
                    done(new Error());
                }
            });

            api.products.search({id: 100}, function (error, body) {
            });
        });

        it('{apiname}:before should be invoke', function (done) {
            var api = create();

            api.use(function (options, next) {
                options['_id'] = '_id';
                return next(new Error('abort'), options);
            });

            api.on('products.search:before', function (error, options) {
                if (options['_id']) {
                    done();
                } else {
                    done(new Error());
                }
            });

            api.products.search({id: 100}, function (error, body) {
            });
        });
    });


    describe('#after', function () {
        it('should be invoke after', function (done) {
            var api = create();

            api.on('after', function (error, body) {
                if (body.status) {
                    done();
                } else {
                    done(new Error());
                }
            });

            api.products.search({id: 100});
        });

        it('should be invoke products.search:after', function (done) {
            var api = create();

            api.on('products.search:after', function (error, body) {
                if (body.status) {
                    done();
                } else {
                    done(new Error());
                }
            });

            api.products.search({id: 100});
        });

        it('should invoke products.search and result status true', function (done) {
            var api = create();

            api.products.search({id: 100}, function (error, body) {
                done(body.status ? null : new Error());
            });
        });


    });

    describe('#request ', function () {
        it('should invoke products.search and result has  error', function (done) {
            var api = create();

            api.use(function (options, next) {
                next(new Error(), null);
            });

            api.products.search({id: 100}, function (error, body) {
                done(error ? null : true);
            });
        });
    });


});
