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
