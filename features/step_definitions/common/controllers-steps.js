const
  should = require('should'),
  {
    When,
    Then
  } = require('cucumber');

When(/I call the( plugin)? route "(\w*)":"(\w*)"( with '(.*)')?/, async function (plugin, controller, action, args) {
  if (plugin) {
    controller = `${this.pluginName}/${controller}`;
  }

  args = JSON.parse(args || '{}');

  try {
    this.props.response = await this.kuzzle.query({
      controller,
      action,
      ...args
    });
  } catch (error) {
    this.props.error = error;
  }
});

Then('I should receive a text result containing {string}', function (expectatedResult) {
  should(this.props.response).not.be.undefined();

  should(this.props.response.result).be.type('string');
  should(this.props.response.result).be.eql(expectatedResult);
});

Then('I should receive an object result containing a property {string}', function (propertyName) {
  should(this.props.response).not.be.undefined();

  should(this.props.response.result).be.Object();
  should(this.props.response.result).has.property(propertyName);
});

Then('I should have an error with status {int} matching {string}', function (status, message) {
  should(this.props.error).not.be.undefined();

  should(this.props.error.status).be.eql(status);
  should(this.props.error.message).match(new RegExp(message));
});
