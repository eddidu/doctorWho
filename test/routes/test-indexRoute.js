var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");

var __base = '../../';
var route = require(__base + 'routes/indexRoute');

chai.should();
chai.use(sinonChai);

describe('indexRoute', function() {
  var req, res, spy;
  var spy = sinon.spy();  

  beforeEach(function() {
  	req, res = {};
  });

  describe('/', function (){
    it('should return index page and set title', function() {
      // init
      req = {url: '/', method: 'GET'};
      res.render = spy;

      route.handle(req, res);

      spy.should.have.been.calledOnce;
      spy.should.have.been.calledWith('index', {title: sinon.match.string});

    });
  });

  afterEach(function() {
    spy.reset();
  });  
});