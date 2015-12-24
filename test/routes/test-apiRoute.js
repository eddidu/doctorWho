var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var mockery = require('mockery');

chai.should();
chai.use(sinonChai);

describe('apiRoute', function() {
  var req, res, router;
  var spy = sinon.spy();
  var stub = sinon.stub();
  var mockService = {};

  before(function() {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mockery.registerMock('../services/queryService', mockService);

    router = require('../../routes/apiRoute');
  });

  after(function() {
    mockery.disable();
  });

  beforeEach(function() {
  	req = res = {};
  });

  afterEach(function() {
    spy.reset();
    stub.reset();
  });  

  describe('/', function (){
    it('TODO: should show an api usage guide', function() {
      req = {url: '/', method: 'GET'};
      res.send = spy;

      router.handle(req, res);

      spy.should.have.been.calledOnce;
      spy.should.have.been.calledWith(sinon.match.string);
    });
  });

  describe('/taxonomy', function (){
    it('should respond with JSON array of specialty names', function(done) {
      req = {url: '/taxonomy', method: 'GET'};
      res.json = spy;

      mockService.getSpecialties = stub;
      var mockResponse = [
        {'name': 'name1'}, 
        {'name': 'name2'}, 
        {'name': 'name3'}, 
        {'name': 'name3'}
      ];
      stub.returns(Promise.resolve(mockResponse));

      router.handle(req, res);

      // TODO: find better way for dealing with promise
      setTimeout(function() {
        spy.should.have.been.calledOnce;
        spy.should.have.been.calledWith(['name1', 'name2', 'name3']);
        done();
      }, 5);
    });
  });

  describe('/doctors', function (){
    it('should throws an error when requested without a parameter');
    it('should respond with JSON array of doctors when requested with {center: [lat, lng]}', function(done) {
      req = {url: '/doctors', method: 'GET', query: {center: [37.644180, -121.152310]}};
      res.json = spy;

      mockService.findDoctors = stub;
      var mockResponse = [{_id: 1}, {_id: 2}, {_id: 3}];
      stub.returns(Promise.resolve(mockResponse));

      router.handle(req, res);

      setTimeout(function() {
        spy.should.have.been.calledOnce;
        spy.should.have.been.calledWith(mockResponse);
        done();
      }, 5);
    });
    it('should throws an error when requested with {center: null}');
    it('should throws an error when requested with invalid center {center: not int[]}');
    it('should respond with JSON array of doctors when requested with {center: [lat, lng], specialty: "specialty name"}', function(done) {
      req = {url: '/doctors', method: 'GET', query: {center: [37.644180, -121.152310], specialty: 'Surgery'}};
      res.json = spy;

      mockService.findDoctors = stub;
      var mockResponse = [{_id: 1}, {_id: 2}, {_id: 3}];
      stub.returns(Promise.resolve(mockResponse));

      router.handle(req, res);

      setTimeout(function() {
        spy.should.have.been.calledOnce;
        spy.should.have.been.calledWith(mockResponse);
        done();
      }, 5);
    });
    it('should throws an error when requested with {center: null, specialty: "specialty name}');
    it('should respond with JSON array of doctors when requested with {center: [lat, lng], specialty: null}');
    it('should respond with JSON array of doctors when requested with {zipcode: 5 digits}');
    it('should throws an error when requested with invalid zipcode, {zipcode: not 5 digits}');    
    it('should respond with JSON array of doctors when requested with {zipcode: 5 digits, specialty: null}');
    it('should respond with JSON array of doctors when requested with {zipcode: 5 digits, specialty: "specialty name"}');
  });
});

// http://howtonode.org/mocking-private-dependencies-using-rewire
//http://javascriptplayground.com/blog/2014/07/testing-express-routes/