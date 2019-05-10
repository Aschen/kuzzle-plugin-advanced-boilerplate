const
  should = require('should'),
  _ = require('lodash'),
  {
    When,
    Then
  } = require('cucumber');

When(/I call the( plugin)? route "(\w*)":"(\w*)"( with '(.*)')?/, async function (plugin, controller, action, args) {
  if (plugin) {
    controller = `${this.pluginName}/${controller}`;
  }

  args = JSON.parse(args || '{}');

  const response = await this.kuzzle.query({
    controller,
    action,
    ...args
  });

  this.props.result = response.result;
});

Then('I should receive a text result containing {string}', function (expectatedResult) {
  should(this.props.result).be.type('string');
  should(this.props.result).be.eql(expectatedResult);
});

Then('I should receive an object result containing a property {string}', function (propertyName) {
  should(this.props.result).be.Object();
  should(this.props.result).has.property(propertyName);
});
