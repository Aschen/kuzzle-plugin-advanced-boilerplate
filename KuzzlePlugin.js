const
  _ = require('lodash'),
  CorePlugin = require('./lib/CorePlugin'),
  buildControllers = require('./lib/controllers')

/**
 * @class KuzzlePlugin
 * @extends CorePlugin
 *
 * @property {KuzzlePluginContext} context
 * @property {ControllerImplementations} controllersInstances
 * @property {Controllers} controllers
 * @property {Object.<string, string>} hooks
 * @property {Object.<string, string>} pipes
 * @property {Routes} routes
 *
 * @externs
 */
class KuzzlePlugin extends CorePlugin {
  constructor () {
    super()

    this.defaultConfig = {}
  }

  /**
   * @param {KuzzlePluginContext} context
   * @returns {Promise.<boolean>}
   */
  init (customConfig, context) {
    this.config = Object.assign(this.defaultConfig, customConfig);

    this.context = context

    this.controllersInstances = buildControllers(context, this.config)

    this.hooks = {}

    this.pipes = {}

    this.controllers =
      Object.values(this.controllersInstances)
        .reduce((memo, controller) => Object.assign(memo, controller.actionsMapping()), {})

    this.routes = _.flatten(
      Object.values(this.controllersInstances)
        .map(controller => controller.routesMapping())
    )
  }
}

module.exports = KuzzlePlugin
