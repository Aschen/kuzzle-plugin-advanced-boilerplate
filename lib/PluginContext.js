/**
 * @class PluginContext
 *
 * @property {KuzzlePluginContext} context
 */
class PluginContext {
  /**
   * @param {KuzzlePluginContext} context
   * @param {object} config
   */
  constructor(context, config) {
    this.context = context
    this.config = config
  }

  /**
   * @param {string} errorType
   * @param {string|null} message
   * @throws {KuzzleError}
   * @protected
   */
  throwError(errorType, message) {
    message = message || null
    throw this.newError(errorType, message)
  }

  /**
   * @param {string} errorType
   * @param {string} [message]
   * @returns {KuzzleError}
   * @protected
   */
  newError(errorType, message) {
    const errorName = errorType + 'Error'

    if (! this.context.errors[errorName]) {
      return this.newError(
        'PluginImplementation',
        `Bad errorType "${errorType}"`
      )
    }

    if (message) {
      return new this.context.errors[errorName](message)
    }

    return new this.context.errors[errorName]()
  }
}

module.exports = PluginContext
