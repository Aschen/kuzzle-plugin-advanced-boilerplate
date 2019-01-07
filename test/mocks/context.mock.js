const
  RequestMock = require('./request.mock'),
  KuzzleErrors = require('kuzzle-common-objects').errors,
  sinon = require('sinon');

class ContextMock {
  constructor() {
    this.accessors = {
      sdk: {
        document: {
          update: sinon.stub().resolves()
        }
      },
      execute: sinon.stub().resolves()
    };

    this.errors = KuzzleErrors;

    this.constructors = {
      Request: RequestMock
    };

    this.log = {
      info: sinon.stub(),
      warn: sinon.stub()
    };
  }
}

module.exports = ContextMock;
