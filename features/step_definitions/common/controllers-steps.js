const
  should = require('should'),
  {
    When,
    Then
  } = require('cucumber');

When(/I call the( plugin)? "(.*)":"(.*)" route/, function (plugin, controller, action) {
  if (plugin) {
    controller = `${this.pluginName}/${controller}`;
  }

  return this.kuzzle.query({
    controller,
    action
  })
    .then(response => {
      this.result = response.result;
    });
});

Then('I should receive a text result containing {string}', function (expectatedResult) {
  should(this.result).be.type('string');
  should(this.result).be.eql(expectatedResult);

  this.result = undefined;
});
