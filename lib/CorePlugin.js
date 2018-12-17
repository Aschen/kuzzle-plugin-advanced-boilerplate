/**
 * @class CorePlugin
 * @externs
 *
 * @property {KuzzlePluginContext} context
 * @property {Controllers} controllers
 * @property {Object.<string, string|string[]>} hooks
 * @property {Routes} routes
 */
class CorePlugin {
  constructor () {
    this.context = null
  }

  /**
   * @param {KuzzleRequest} request
   * @returns {Promise.<T>}
   * @externs
   */
  async call (request) {
    const controller = request.input.controller.split('/')[1]
    const action = request.input.action
    /* /!\ Really needed here ? (await) */
    return await this.controllersInstances[controller][action](request)
  }

  /**
   * Method that can be plugged on the the hook mechanism to debug requests
   *
   * @param {KuzzleRequest} request
   * @param {string} event
   * @protected
   */
  debugRequest (request, event) {
    /* eslint-disable no-console */
    if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
      console.log(`Event: ${event}`)
      if (typeof request.serialize === 'function') {
        console.log(`Request payload: ${JSON.stringify(request.serialize(), null, 2)}`)
      } else {
        console.log('Request: ', request)
      }
    }
  }
}

module.exports = CorePlugin
