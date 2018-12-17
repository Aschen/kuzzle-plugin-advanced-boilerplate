const
  ExampleController = require('./ExampleController')

/**
 * @param {KuzzlePluginContext} context
 * @param {object} config
 * @returns {ControllerImplementations}
 */
module.exports = (context, config) => ({
  example: new ExampleController(context, config)
})
