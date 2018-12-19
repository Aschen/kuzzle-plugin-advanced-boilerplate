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
