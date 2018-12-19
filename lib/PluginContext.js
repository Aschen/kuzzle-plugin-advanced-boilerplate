/*
 * Kuzzle, a backend software, self-hostable and ready to use
 * to power modern apps
 *
 * Copyright 2015-2018 Kuzzle
 * mailto: support AT kuzzle.io
 * website: http://kuzzle.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
