'use strict'
module.exports = require('apickli/apickli-gherkin');

const { Given, Then, setDefaultTimeout } = require('cucumber')
const apickli = require('apickli');
const fs = require('fs')
const path = require('path')
const { expect } = require('chai')
setDefaultTimeout(60 * 1000);

Given('the application host is on {string}', function (hostname) {
  this.hostname = hostname;
});

Given('the port is {string}', function (port) {
  this.port = port;
});

Given('the protocol is {string}', function (protocol) {
  this.protocol = protocol;
});

Given('the application is running', function () {
  this.apickli = new apickli.Apickli(this.protocol, `${this.hostname}:${this.port}`);
  this.apickli.addRequestHeader('Cache-Control', 'no-cache');
});

Given('I set the request body to the contents of the resource file {string}', function (file) {
  const bodyValue = fs.readFileSync(path.resolve(`./test/resources/${file}`), 'utf8');
  this.apickli.setRequestBody(bodyValue);
});

Then('response body is empty', function () {
  const actual = this.apickli.getResponseObject().body
  return expect(actual).to.equal('')
});

Then('response body matches {string}', function (expectedBodyFileName) {
  const expected = JSON.parse(fs.readFileSync(path.resolve(`./test/resources/${expectedBodyFileName}`), 'utf8'))
  const actual = JSON.parse(this.apickli.getResponseObject().body)
  return expect(actual).to.deep.equal(expected)
});
