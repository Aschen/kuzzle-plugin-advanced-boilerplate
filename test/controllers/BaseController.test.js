const
  BaseController = require('../../lib/controllers/BaseController'),
  should = require('should')

describe('BaseController', () => {
  let
    baseController

  beforeEach(() => {
    baseController = new BaseController({}, {})
  })

  describe('#actionsMapping', () => {

    it('return the controller actions mapping', () => {
      baseController.name = 'base'
      baseController.actions = [ 'foo', 'bar' ]

      const actionsMapping = baseController.actionsMapping()

      should(actionsMapping).be.eql({
        base: {
          foo: 'call',
          bar: 'call'
        }
      })
    })
  })

})
