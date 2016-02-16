var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');

chai.should();
chai.use(sinonChai);

describe('indexRoute', function() {

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
    router = require('../../routes/indexRoute');
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
    it('should return index page and set title', function() {
      req = {url: '/', method: 'GET'};
      res.render = spy;

      mockService.getSpecialtyGroups = stub;
      var mockResponse = [
        {'name': 'name1'}, 
        {'name': 'name2'}, 
        {'name': 'name3'}, 
        {'name': 'name3'}
      ];
      stub.returns(Promise.resolve(mockResponse));

      router.handle(req, res);

      setTimeout(function() {
        spy.should.have.been.calledOnce;
        spy.should.have.been.calledWith('index', {title: sinon.match.string, specialtyGroups: ['name1', 'name2', 'name3']});
        done();
      }, 5);

    });
  });
});