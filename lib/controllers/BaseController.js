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
  PluginContext = require('../PluginContext')

/**
 * @class BaseController
 * @extends PluginContext
 */
class BaseController extends PluginContext {
  /**
   * @param {KuzzlePluginContext} context
   * @param {object} config
   */
  constructor (context, config) {
    super(context, config)

    this.name = null
    this.actions = []
    this.routes = []
  }

  /**
   * @param {KuzzleRequest} request
   * @returns {FlattenedKuzzleUser}
   */
  currentUser (request) {
    const user = JSON.parse(JSON.stringify(request.context.user))

    user._type = 'users'
    user._isFlatten = true

    return user
  }

  actionsMapping () {
    return {
      [this.name]: this.actions.reduce((actions, action) => {
        actions[action] = 'call'
        return actions
      }, {})
    }
  }

  routesMapping () {
    return this.routes.map(route => {
      route.controller = this.name
      route.url = `/${this.name}${route.url}`
      return route
    })
  }

  param (request, name) {
    const args = request.input.args || {}
    const body = request.input.body || {}

    return args[name] || body[name]
  }

  /**
   * @param {KuzzleRequest} request
   * @returns {string}
   * @protected
   */
  _getId(request) {
    if (!request.input.resource._id) {
      this._throwError('BadRequest', 'Missing argument "_id"')
    }

    return request.input.resource._id
  }

  /**
   * @param {KuzzleRequest} request
   * @param {string} argument
   * @param {?string} defaultValue
   * @returns {string}
   * @protected
   */
  _getStringArgument(request, argument, defaultValue = null) {
    if (!request.input.args[argument] && defaultValue === null) {
      this._throwError('BadRequest', `Missing argument "${argument}"`)
    }

    if (
      request.input.args[argument] &&
      typeof request.input.args[argument] !== 'string'
    ) {
      this._throwError(
        'BadRequest',
        `Invalid argument "${argument} value "${request.input.args[argument]}"`
      )
    }

    return request.input.args[argument]
      ? request.input.args[argument]
      : defaultValue
  }

  /**
   * Note: As http requests can't send boolean argument types, but other protocols do,
   *       we consider the 'true' string value as true, every other string value returns false.
   *       A boolean value works as expected.
   *
   * @param {KuzzleRequest} request
   * @param {string} argument
   * @param {?boolean} defaultValue
   * @returns {boolean}
   * @protected
   */
  _getBooleanArgument(request, argument, defaultValue = null) {
    const valueType = typeof request.input.args[argument]

    if (valueType === 'undefined' && defaultValue === null) {
      this._throwError('BadRequest', `Missing argument "${argument}"`)
    }

    if (!['undefined', 'string', 'boolean'].includes(valueType)) {
      this._throwError(
        'BadRequest',
        `Invalid argument "${argument} value "${request.input.args[argument]}"`
      )
    }

    switch (valueType) {
      case 'boolean':
        return request.input.args[argument]
      case 'string':
        return request.input.args[argument] === 'true'
      default:
        return defaultValue
    }
  }

  /**
   * @param {KuzzleRequest} request
   * @param {string} argument
   * @param {?number} defaultValue
   * @returns {number}
   * @protected
   */
  _getNumberArgument(request, argument, defaultValue = null) {
    if (!request.input.args[argument] && defaultValue === null) {
      this._throwError('BadRequest', `Missing argument "${argument}"`)
    }

    if (
      request.input.args[argument] &&
      !Number.isInteger(Number.parseInt(request.input.args[argument]))
    ) {
      this._throwError(
        'BadRequest',
        `Invalid argument "${argument}" value "${request.input.args[argument]}"`
      )
    }

    return request.input.args[argument]
      ? Number.parseInt(request.input.args[argument])
      : defaultValue
  }

  /**
   * @param {KuzzleRequest} request
   * @param {string} argument
   * @param {string[]|null} [defaultValue=null]
   * @returns {string[]}
   * @protected
   */
  _getArrayArgument(request, argument, defaultValue = null) {
    if (!request.input.args[argument] && defaultValue === null) {
      this._throwError('BadRequest', `Missing argument "${argument}"`)
    }

    if (request.input.args[argument]) {
      return Array.isArray(request.input.args[argument])
        ? request.input.args[argument]
        : [request.input.args[argument]]
    }

    return defaultValue
  }

  /**
   * @param {KuzzleRequest} request
   * @returns {number}
   * @protected
   */
  _getFromArgument(request) {
    return this._getNumberArgument(request, 'from', 0)
  }

  /**
   * @param {KuzzleRequest} request
   * @param {number|null} defaultValue
   * @returns {number}
   * @protected
   */
  _getSizeArgument(request, defaultValue = null) {
    return this._getNumberArgument(request, 'size', defaultValue)
  }

  /**
   * @param {KuzzleRequest} request
   * @param {string} property
   * @param {?string} defaultValue
   * @returns {string}
   * @protected
   */
  _getStringFromBody(request, property, defaultValue = null) {
    if (
      (!request.input.body || !request.input.body[property]) &&
      defaultValue === null
    ) {
      this._throwError('BadRequest', `Missing body property "${property}"`)
    }

    if (
      request.input.body[property] &&
      typeof request.input.body[property] !== 'string'
    ) {
      this._throwError(
        'BadRequest',
        `Invalid body property "${property} value "${
          request.input.body[property]
        }"`
      )
    }

    return request.input.body[property]
      ? request.input.body[property]
      : defaultValue
  }

  /**
   * @param {KuzzleRequest} request
   * @param {string} property
   * @param {string[]|null} [defaultValue=null]
   * @returns {string[]}
   * @protected
   */
  _getArrayFromBody(request, property, defaultValue = null) {
    if (!request.input.body[property] && defaultValue === null) {
      this._throwError('BadRequest', `Missing body property "${property}"`)
    }

    if (request.input.body[property]) {
      return Array.isArray(request.input.body[property])
        ? request.input.body[property]
        : [request.input.body[property]]
    }

    return defaultValue
  }

  /**
   * @param {KuzzleRequest} request
   * @param {string} property
   * @param {?boolean} defaultValue
   * @returns {boolean}
   * @protected
   */
  _getBooleanFromBody(request, property, defaultValue = null) {
    if (
      (!request.input.body || request.input.body[property] === undefined) &&
      defaultValue === null
    ) {
      this._throwError('BadRequest', `Missing body property "${property}"`)
    }

    if (
      request.input.body[property] !== null &&
      typeof request.input.body[property] !== 'boolean'
    ) {
      this._throwError(
        'BadRequest',
        `Invalid body property "${property} value "${
          request.input.body[property]
        }"`
      )
    }

    return request.input.body[property] !== null &&
      request.input.body[property] !== undefined
      ? request.input.body[property]
      : defaultValue
  }

  /**
   * @param {KuzzleRequest} request
   * @param {string} property
   * @param {?number} defaultValue
   * @returns {number}
   * @protected
   */
  _getNumberFromBody(request, property, defaultValue = null) {
    if (
      (!request.input.body || !request.input.body[property]) &&
      defaultValue === null
    ) {
      this._throwError('BadRequest', `Missing body property "${property}"`)
    }

    if (
      request.input.body[property] &&
      typeof request.input.body[property] !== 'number'
    ) {
      this._throwError(
        'BadRequest',
        `Invalid body property "${property}" value "${
          request.input.body[property]
        }"`
      )
    }

    return request.input.body[property]
      ? request.input.body[property]
      : defaultValue
  }

  /**
   * @param {KuzzleRequest} request
   * @param {string} property
   * @param {object} [subFieldTypeMapping=null]
   * @param {object} [defaultValue=null]
   * @returns {object}
   * @protected
   */
  _getObjectFromBody(
    request,
    property,
    subFieldTypeMapping = null,
    defaultValue = null
  ) {
    if (
      (!request.input.body || !request.input.body[property]) &&
      defaultValue === null
    ) {
      this._throwError('BadRequest', `Missing body property "${property}"`)
    }

    if (
      request.input.body[property] &&
      typeof request.input.body[property] !== 'object'
    ) {
      this._throwError(
        'BadRequest',
        `Invalid body property "${property} value "${
          request.input.body[property]
        }"`
      )
    }

    const value = request.input.body[property]
      ? request.input.body[property]
      : defaultValue

    if (subFieldTypeMapping === null) {
      return value
    }

    if (
      !Object.keys(value).every(field =>
        Object.keys(subFieldTypeMapping).includes(field)
      ) ||
      !Object.keys(subFieldTypeMapping).every(
        field => typeof value[field] === subFieldTypeMapping[field]
      )
    ) {
      this._throwError('BadRequest', `Bad sub-property in property ${property}`)
    }

    return value
  }

  /**
   * Note: As http requests can't send boolean argument types, but other protocols do,
   *       we consider the 'true' string value as true, every other string value returns false.
   *       A boolean value works as expected.
   *
   * @param {KuzzleRequest} request
   * @param {string} argument
   * @param {?boolean} defaultValue
   * @returns {boolean}
   * @protected
   */
  _getBooleanHeader(request, argument, defaultValue = null) {
    const valueType = typeof request.input.headers[argument]

    if (valueType === 'undefined' && defaultValue === null) {
      this._throwError('BadRequest', `Missing argument "${argument}"`)
    }

    if (!['undefined', 'string', 'boolean'].includes(valueType)) {
      this._throwError(
        'BadRequest',
        `Invalid argument "${argument} value "${
          request.input.headers[argument]
        }"`
      )
    }

    switch (valueType) {
      case 'boolean':
        return request.input.headers[argument]
      case 'string':
        return request.input.headers[argument] === 'true'
      default:
        return defaultValue
    }
  }
}

module.exports = BaseController
