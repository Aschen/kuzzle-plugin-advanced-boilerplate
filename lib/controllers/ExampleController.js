const
  BaseController = require('./BaseController')

/**
 * @class ExampleController
 * @extends BaseController
 */
class ExampleController extends BaseController {

  constructor (context, config) {
    super(context, config)

    this.name = 'example'

    this.actions = [
      'info'
    ]

    // Generated route: GET _plugin/kuzzle-plugin-advanced-boilerplate/example/info
    this.routes = [
      { verb: 'get', url: '/info', action: 'info'}
    ]
  }

  async info (request) {
    return `Hello from example/info. Current user id: ${request.context.user._id}`
  }
}

module.exports = ExampleController
