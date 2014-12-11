var pattern = require('../../lib/route');
require('should');


describe('route', function () {

    it('shoud be match not contains ?', function () {
        pattern.parse('/users/:id', {id: 1000}).should.be.equal('/users/1000');
    });

    it('shoud be match not contains ?,params is not change', function () {
        var params = {id: 1000};
        pattern.parse('/users/:id', params).should.be.equal('/users/1000');
        params.should.have.property('id', 1000);
    });

    it('shoud be match not contains ?, and query', function () {
        pattern.parse('/users/:id?type=:type', {id: 1000, type: 1}).should.be.equal('/users/1000?type=1');
    });

    it('shoud be match not contains ?, and query', function () {
        pattern.parse('/users/:id?', {id: 1000, type: 1}).should.be.equal('/users/1000?&type=1');
    });

    it('shoud be match  contains ?', function () {
        pattern.parse('/users/:id?test=123', {id: 1000, format: 'json'}).should.be.equal('/users/1000?test=123&format=json');
    });
});
