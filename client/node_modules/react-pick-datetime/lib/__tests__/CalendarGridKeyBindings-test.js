"use strict";

var CalendarGridKeyBindings = require("../CalendarGridKeyBindings");

var emptyFunction = require("react-pick/lib/helpers/emptyFunction");
var expect = require("expect");
var getMockFunction = require("react-pick/lib/helpers/getMockFunction");
var moment = require("moment");

var KEY_ARROW_DOWN = 40;
var KEY_ARROW_UP = 38;
var KEY_ARROW_LEFT = 37;
var KEY_ARROW_RIGHT = 39;
var KEY_RETURN = 13;
var KEY_ESC = 27;

function getMockKeyEvent(keyCode) {
  return {
    preventDefault: getMockFunction(),
    keyCode: keyCode
  };
}

describe("CalendarGridKeyBindings", function () {
  var value = moment();

  it("requests one week later on KEY_ARROW_DOWN", function () {
    var onChangeMock = getMockFunction();

    CalendarGridKeyBindings.handleKeyDown({
      value: value,
      onChange: onChangeMock,
      onComplete: emptyFunction,
      onCancel: emptyFunction
    }, getMockKeyEvent(KEY_ARROW_DOWN));

    expect(onChangeMock.calls.length).toBe(1);
    expect(onChangeMock.calls[0][0].toISOString()).toEqual(moment(value).add(1, "weeks").toISOString());
  });

  it("requests one week earlier on KEY_ARROW_UP", function () {
    var onChangeMock = getMockFunction();

    CalendarGridKeyBindings.handleKeyDown({
      value: value,
      onChange: onChangeMock,
      onComplete: emptyFunction,
      onCancel: emptyFunction
    }, getMockKeyEvent(KEY_ARROW_UP));

    expect(onChangeMock.calls.length).toBe(1);
    expect(onChangeMock.calls[0][0].toISOString()).toEqual(moment(value).subtract(1, "weeks").toISOString());
  });

  it("requests one day earlier on KEY_ARROW_LEFT", function () {
    var onChangeMock = getMockFunction();

    CalendarGridKeyBindings.handleKeyDown({
      value: value,
      onChange: onChangeMock,
      onComplete: emptyFunction,
      onCancel: emptyFunction
    }, getMockKeyEvent(KEY_ARROW_LEFT));

    expect(onChangeMock.calls.length).toBe(1);
    expect(onChangeMock.calls[0][0].toISOString()).toEqual(moment(value).subtract(1, "days").toISOString());
  });

  it("requests one day later on KEY_ARROW_RIGHT", function () {
    var onChangeMock = getMockFunction();

    CalendarGridKeyBindings.handleKeyDown({
      value: value,
      onChange: onChangeMock,
      onComplete: emptyFunction,
      onCancel: emptyFunction
    }, getMockKeyEvent(KEY_ARROW_RIGHT));

    expect(onChangeMock.calls.length).toBe(1);
    expect(onChangeMock.calls[0][0].toISOString()).toEqual(moment(value).add(1, "days").toISOString());
  });

  it("completes current date on KEY_RETURN", function () {
    var onCompleteMock = getMockFunction();

    CalendarGridKeyBindings.handleKeyDown({
      value: value,
      onChange: emptyFunction,
      onComplete: onCompleteMock,
      onCancel: emptyFunction
    }, getMockKeyEvent(KEY_RETURN));

    expect(onCompleteMock.calls.length).toBe(1);
    expect(onCompleteMock.calls[0][0].toISOString()).toEqual(value.toISOString());
  });

  it("cancels on KEY_ESC", function () {
    var onCancelMock = getMockFunction();

    CalendarGridKeyBindings.handleKeyDown({
      value: value,
      onChange: emptyFunction,
      onComplete: emptyFunction,
      onCancel: onCancelMock
    }, getMockKeyEvent(KEY_ESC));

    expect(onCancelMock.calls.length).toBe(1);
  });
});