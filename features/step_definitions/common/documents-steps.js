const
  _ = require('lodash'),
  should = require('should'),
  {
    Given,
    Then
  } = require('cucumber');

Given('a collection {string}:{string}', async function (index, collection) {
  await this.kuzzle.index.create(index);
  await this.kuzzle.collection.create(index, collection);

  this.props.index = index;
  this.props.collection = collection;
});

Given('an existing collection {string}:{string}', async function (index, collection) {
  if (!await this.kuzzle.index.exists(index)) {
    throw new Error(`Index ${index} does not exists`);
  }
  if (!await this.kuzzle.collection.exists(index, collection)) {
    throw new Error(`Collection ${index}:${collection} does not exists`);
  }

  this.props.index = index;
  this.props.collection = collection;
});

Given('I create the document {string} with id {string}', async function (documentRaw, documentId) {
  const document = JSON.parse(documentRaw);

  await this.kuzzle.document.create(this.props.index, this.props.collection, document, documentId);
});

Then(/The document "(.*)" has a property "(.*)"( with value '(.*)')?/, async function (documentId, propertyName, value) {
  const response = await this.kuzzle.document.get(this.props.index, this.props.collection, documentId);

  const property = _.get(response._source, propertyName);

  should(property).not.be.undefined();

  if (value) {
    should(property).be.eql(JSON.parse(value));
  }
});
