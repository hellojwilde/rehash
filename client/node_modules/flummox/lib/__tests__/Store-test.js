"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _Flux = require("../Flux");

var Store = _Flux.Store;
var Flux = _Flux.Flux;
var Actions = _Flux.Actions;

var sinon = _interopRequire(require("sinon"));

describe("Store", function () {
  var ExampleStore = (function (_Store) {
    function ExampleStore() {
      _classCallCheck(this, ExampleStore);

      _get(Object.getPrototypeOf(ExampleStore.prototype), "constructor", this).call(this);
      this.state = { foo: "bar" };
    }

    _inherits(ExampleStore, _Store);

    return ExampleStore;
  })(Store);

  var actionId = "actionId";

  describe("#register()", function () {
    it("adds handler to internal collection of handlers", function () {
      var _store$_handlers;

      var store = new ExampleStore();
      var handler = sinon.spy();
      store.register(actionId, handler);

      var mockArgs = ["foo", "bar"];
      (_store$_handlers = store._handlers)[actionId].apply(_store$_handlers, mockArgs);

      expect(handler.calledWith.apply(handler, mockArgs)).to.be["true"];
    });

    it("binds handler to store", function () {
      var store = new ExampleStore();
      store.foo = "bar";

      function handler() {
        return this.foo;
      }

      store.register(actionId, handler);

      expect(store._handlers[actionId]()).to.equal("bar");
    });

    it("accepts actions instead of action ids", function () {
      var _store$_handlers;

      var ExampleActions = (function (_Actions) {
        function ExampleActions() {
          _classCallCheck(this, ExampleActions);

          if (_Actions != null) {
            _Actions.apply(this, arguments);
          }
        }

        _inherits(ExampleActions, _Actions);

        _createClass(ExampleActions, {
          getFoo: {
            value: function getFoo() {
              return "foo";
            }
          }
        });

        return ExampleActions;
      })(Actions);

      var actions = new ExampleActions();
      var store = new ExampleStore();
      var handler = sinon.spy();
      store.register(actions.getFoo, handler);

      var mockArgs = ["foo", "bar"];
      (_store$_handlers = store._handlers)[actions.getFoo._id].apply(_store$_handlers, mockArgs);

      expect(handler.calledWith.apply(handler, mockArgs)).to.be["true"];
    });

    it("ignores non-function handlers", function () {
      var store = new ExampleStore();
      expect(store.register.bind(store, null)).not.to["throw"]();
    });
  });

  it("default state is null", function () {
    var store = new Store();
    expect(store.state).to.be["null"];
  });

  describe("#registerAsync()", function () {
    it("registers handlers for begin, success, and failure of async action", function callee$2$0() {
      var error, ExampleActions, ExampleFlux, flux, actions, store, handler, begin, success, failure;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            error = new Error();

            ExampleActions = (function (_Actions) {
              function ExampleActions() {
                _classCallCheck(this, ExampleActions);

                if (_Actions != null) {
                  _Actions.apply(this, arguments);
                }
              }

              _inherits(ExampleActions, _Actions);

              _createClass(ExampleActions, {
                getFoo: {
                  value: function getFoo(message) {
                    var _success = arguments[1] === undefined ? true : arguments[1];

                    return regeneratorRuntime.async(function getFoo$(context$5$0) {
                      while (1) switch (context$5$0.prev = context$5$0.next) {
                        case 0:
                          if (_success) {
                            context$5$0.next = 2;
                            break;
                          }

                          throw error;

                        case 2:
                          return context$5$0.abrupt("return", message + " success");

                        case 3:
                        case "end":
                          return context$5$0.stop();
                      }
                    }, null, this);
                  }
                },
                getBar: {
                  value: function getBar(message) {
                    return regeneratorRuntime.async(function getBar$(context$5$0) {
                      while (1) switch (context$5$0.prev = context$5$0.next) {
                        case 0:
                          return context$5$0.abrupt("return", message);

                        case 1:
                        case "end":
                          return context$5$0.stop();
                      }
                    }, null, this);
                  }
                }
              });

              return ExampleActions;
            })(Actions);

            ExampleFlux = (function (_Flux) {
              function ExampleFlux() {
                _classCallCheck(this, ExampleFlux);

                _get(Object.getPrototypeOf(ExampleFlux.prototype), "constructor", this).call(this);
                this.createActions("example", ExampleActions);
                this.createStore("example", ExampleStore);
              }

              _inherits(ExampleFlux, _Flux);

              return ExampleFlux;
            })(Flux);

            flux = new ExampleFlux();
            actions = flux.getActions("example");
            store = flux.getStore("example");
            handler = sinon.spy();

            store.register(actions.getBar, handler);

            context$3$0.next = 10;
            return actions.getBar("bar");

          case 10:
            expect(handler.calledOnce).to.be["true"];
            expect(handler.firstCall.args).to.deep.equal(["bar"]);

            begin = sinon.spy();
            success = sinon.spy();
            failure = sinon.spy();

            store.registerAsync(actions.getFoo, begin, success, failure);

            context$3$0.next = 18;
            return actions.getFoo("foo", true);

          case 18:
            expect(begin.calledOnce).to.be["true"];
            expect(begin.firstCall.args).to.deep.equal(["foo", true]);
            expect(success.calledOnce).to.be["true"];
            expect(success.firstCall.args[0]).to.equal("foo success");
            expect(failure.called).to.be["false"];

            context$3$0.next = 25;
            return expect(actions.getFoo("bar", false)).to.be.rejected;

          case 25:

            expect(begin.calledTwice).to.be["true"];
            expect(success.calledOnce).to.be["true"];
            expect(failure.calledOnce).to.be["true"];
            expect(failure.firstCall.args[0]).to.equal(error);

          case 29:
          case "end":
            return context$3$0.stop();
        }
      }, null, this);
    });

    it("ignores non-function handlers", function () {
      var store = new ExampleStore();
      expect(store.registerAsync.bind(store, null)).not.to["throw"]();
    });
  });

  describe("#registerAll()", function () {
    it("adds handler to internal collection of \"catch all\" handlers", function () {
      var _store$_catchAllHandlers;

      var store = new ExampleStore();
      var handler = sinon.spy();
      store.registerAll(handler);

      var mockArgs = ["foo", "bar"];
      (_store$_catchAllHandlers = store._catchAllHandlers)[0].apply(_store$_catchAllHandlers, mockArgs);

      expect(handler.calledWith.apply(handler, mockArgs)).to.be["true"];
    });

    it("adds multiple handlers to internal collection of \"catch all\" handlers", function () {
      var _store$_catchAllHandlers, _store$_catchAllHandlers2;

      var store = new ExampleStore();
      var handler1 = sinon.spy();
      var handler2 = sinon.spy();
      store.registerAll(handler1);
      store.registerAll(handler2);

      var mockArgs = ["foo", "bar"];
      (_store$_catchAllHandlers = store._catchAllHandlers)[0].apply(_store$_catchAllHandlers, mockArgs);
      (_store$_catchAllHandlers2 = store._catchAllHandlers)[1].apply(_store$_catchAllHandlers2, mockArgs);

      expect(handler1.calledWith.apply(handler1, mockArgs)).to.be["true"];
      expect(handler2.calledWith.apply(handler2, mockArgs)).to.be["true"];
    });

    it("binds handler to store", function () {
      var store = new ExampleStore();
      store.foo = "bar";

      function handler() {
        return this.foo;
      }

      store.registerAll(handler);

      expect(store._catchAllHandlers[0]()).to.equal("bar");
    });

    it("accepts actions instead of action ids", function () {
      var _store$_catchAllHandlers;

      var ExampleActions = (function (_Actions) {
        function ExampleActions() {
          _classCallCheck(this, ExampleActions);

          if (_Actions != null) {
            _Actions.apply(this, arguments);
          }
        }

        _inherits(ExampleActions, _Actions);

        _createClass(ExampleActions, {
          getFoo: {
            value: function getFoo() {
              return "foo";
            }
          }
        });

        return ExampleActions;
      })(Actions);

      var actions = new ExampleActions();
      var store = new ExampleStore();
      var handler = sinon.spy();
      store.registerAll(handler);

      var mockArgs = ["foo", "bar"];
      (_store$_catchAllHandlers = store._catchAllHandlers)[0].apply(_store$_catchAllHandlers, mockArgs);

      expect(handler.calledWith.apply(handler, mockArgs)).to.be["true"];
    });

    it("ignores non-function handlers", function () {
      var store = new ExampleStore();
      expect(store.registerAll.bind(store, null)).not.to["throw"]();
    });
  });

  describe("#registerAllAsync()", function () {
    it("registers \"catch all\" handlers for begin, success, and failure of async action", function callee$2$0() {
      var error, ExampleActions, ExampleFlux, flux, actions, store, begin, success, failure;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            error = new Error();

            ExampleActions = (function (_Actions) {
              function ExampleActions() {
                _classCallCheck(this, ExampleActions);

                if (_Actions != null) {
                  _Actions.apply(this, arguments);
                }
              }

              _inherits(ExampleActions, _Actions);

              _createClass(ExampleActions, {
                getFoo: {
                  value: function getFoo(message) {
                    var _success = arguments[1] === undefined ? true : arguments[1];

                    return regeneratorRuntime.async(function getFoo$(context$5$0) {
                      while (1) switch (context$5$0.prev = context$5$0.next) {
                        case 0:
                          if (_success) {
                            context$5$0.next = 2;
                            break;
                          }

                          throw error;

                        case 2:
                          return context$5$0.abrupt("return", message + " success");

                        case 3:
                        case "end":
                          return context$5$0.stop();
                      }
                    }, null, this);
                  }
                },
                getBar: {
                  value: function getBar(message) {
                    var _success = arguments[1] === undefined ? true : arguments[1];

                    return regeneratorRuntime.async(function getBar$(context$5$0) {
                      while (1) switch (context$5$0.prev = context$5$0.next) {
                        case 0:
                          if (_success) {
                            context$5$0.next = 2;
                            break;
                          }

                          throw error;

                        case 2:
                          return context$5$0.abrupt("return", message + " success");

                        case 3:
                        case "end":
                          return context$5$0.stop();
                      }
                    }, null, this);
                  }
                }
              });

              return ExampleActions;
            })(Actions);

            ExampleFlux = (function (_Flux) {
              function ExampleFlux() {
                _classCallCheck(this, ExampleFlux);

                _get(Object.getPrototypeOf(ExampleFlux.prototype), "constructor", this).call(this);
                this.createActions("example", ExampleActions);
                this.createStore("example", ExampleStore);
              }

              _inherits(ExampleFlux, _Flux);

              return ExampleFlux;
            })(Flux);

            flux = new ExampleFlux();
            actions = flux.getActions("example");
            store = flux.getStore("example");
            begin = sinon.spy();
            success = sinon.spy();
            failure = sinon.spy();

            store.registerAllAsync(begin, success, failure);

            context$3$0.next = 12;
            return actions.getFoo("foo", true);

          case 12:
            expect(begin.calledOnce).to.be["true"];
            expect(begin.firstCall.args).to.deep.equal(["foo", true]);
            expect(success.calledOnce).to.be["true"];
            expect(success.firstCall.args[0]).to.equal("foo success");
            expect(failure.called).to.be["false"];

            context$3$0.next = 19;
            return expect(actions.getFoo("bar", false)).to.be.rejected;

          case 19:
            expect(begin.calledTwice).to.be["true"];
            expect(success.calledOnce).to.be["true"];
            expect(failure.calledOnce).to.be["true"];
            expect(failure.firstCall.args[0]).to.equal(error);

            context$3$0.next = 25;
            return actions.getBar("foo", true);

          case 25:
            expect(begin.calledThrice).to.be["true"];
            expect(begin.thirdCall.args).to.deep.equal(["foo", true]);
            expect(success.calledTwice).to.be["true"];
            expect(success.secondCall.args[0]).to.equal("foo success");
            expect(failure.calledTwice).to.be["false"];

            context$3$0.next = 32;
            return expect(actions.getBar("bar", false)).to.be.rejected;

          case 32:
            expect(begin.callCount).to.equal(4);
            expect(success.calledTwice).to.be["true"];
            expect(failure.calledTwice).to.be["true"];
            expect(failure.secondCall.args[0]).to.equal(error);

          case 36:
          case "end":
            return context$3$0.stop();
        }
      }, null, this);
    });

    it("ignores non-function handlers", function () {
      var store = new ExampleStore();
      expect(store.registerAsync.bind(store, null)).not.to["throw"]();
    });
  });

  describe("#handler()", function () {
    it("delegates dispatches to registered handlers", function () {
      var store = new ExampleStore();
      var handler = sinon.spy();
      store.register(actionId, handler);

      // Simulate dispatch
      var body = { foo: "bar" };
      store.handler({ body: body, actionId: actionId });

      expect(handler.calledWith(body)).to.be["true"];
    });

    it("delegates dispatches to registered \"catch all\" handlers", function () {
      var store = new ExampleStore();
      var handler = sinon.spy();
      var actionIds = ["actionId1", "actionId2"];
      store.registerAll(handler);

      // Simulate dispatch
      var body = { foo: "bar" };
      store.handler({ body: body, actionId: actionIds[0] });
      store.handler({ body: body, actionId: actionIds[1] });

      expect(handler.calledWith(body)).to.be["true"];
      expect(handler.calledTwice).to.be["true"];
    });
  });

  describe("#waitFor()", function () {
    it("waits for other stores", function () {
      var flux = new Flux();
      var result = [];

      var store2 = undefined;

      var Store1 = (function (_Store2) {
        function Store1() {
          _classCallCheck(this, Store1);

          _get(Object.getPrototypeOf(Store1.prototype), "constructor", this).call(this);

          this.register(actionId, function () {
            this.waitFor(store2);
            result.push(1);
          });
        }

        _inherits(Store1, _Store2);

        return Store1;
      })(Store);

      var Store2 = (function (_Store3) {
        function Store2() {
          _classCallCheck(this, Store2);

          _get(Object.getPrototypeOf(Store2.prototype), "constructor", this).call(this);

          this.register(actionId, function () {
            result.push(2);
          });
        }

        _inherits(Store2, _Store3);

        return Store2;
      })(Store);

      flux.createStore("store1", Store1);
      flux.createStore("store2", Store2);

      store2 = flux.getStore("store2");

      flux.dispatch(actionId, "foobar");

      expect(result).to.deep.equal([2, 1]);
    });
  });

  describe("#forceUpdate()", function () {
    it("emits change event", function () {
      var store = new ExampleStore();
      var listener = sinon.spy();
      store.addListener("change", listener);

      store.forceUpdate();

      expect(listener.calledOnce).to.be["true"];
    });

    it("doesn't modify existing state", function () {
      var store = new ExampleStore();
      var listener = sinon.spy();
      store.addListener("change", listener);

      store.register(actionId, function () {
        this.replaceState({ bar: "baz" });
        this.forceUpdate();

        expect(this.state).to.deep.equal({ foo: "bar" });
        expect(listener.called).to.be["false"];

        this.setState({ foo: "bar" });
        this.forceUpdate();
        this.replaceState({ baz: "foo" });
      });

      // Simulate dispatch
      store.handler({ actionId: actionId, body: "foobar" });

      expect(listener.calledOnce).to.be["true"];
      expect(store.state).to.deep.equal({ baz: "foo" });
    });
  });

  describe("#setState()", function () {
    it("shallow merges old state with new state", function () {
      var store = new ExampleStore();

      store.setState({ bar: "baz" });

      expect(store.state).to.deep.equal({
        foo: "bar",
        bar: "baz" });
    });

    it("supports transactional updates", function () {
      var store = new Store();
      store.state = { a: 1 };
      store.setState(function (state) {
        return { a: state.a + 1 };
      });
      expect(store.state.a).to.equal(2);
      store.setState(function (state) {
        return { a: state.a + 1 };
      });
      expect(store.state.a).to.equal(3);
      store.setState(function (state) {
        return { a: state.a + 1 };
      });
      expect(store.state.a).to.equal(4);
    });

    it("emits change event", function () {
      var store = new ExampleStore();
      var listener = sinon.spy();
      store.addListener("change", listener);

      store.setState({ foo: "bar" });

      expect(listener.calledOnce).to.be["true"];
    });

    it("batches multiple state updates within action handler", function () {
      var store = new ExampleStore();
      var listener = sinon.spy();
      store.addListener("change", listener);

      store.register(actionId, function () {
        this.setState({ bar: "baz" });

        expect(this.state).to.deep.equal({ foo: "bar" });
        expect(listener.called).to.be["false"];

        this.setState({ baz: "foo" });
      });

      // Simulate dispatch
      store.handler({ actionId: actionId, body: "foobar" });

      expect(listener.calledOnce).to.be["true"];
      expect(store.state).to.deep.equal({ foo: "bar", bar: "baz", baz: "foo" });
    });
  });

  describe("#replaceState()", function () {
    it("replaces old state with new state", function () {
      var store = new ExampleStore();

      store.replaceState({ bar: "baz" });

      expect(store.state).to.deep.equal({
        bar: "baz" });
    });

    it("batches multiple state updates within action handler", function () {
      var store = new ExampleStore();
      var listener = sinon.spy();
      store.addListener("change", listener);

      store.register(actionId, function () {
        this.replaceState({ bar: "baz" });

        expect(this.state).to.deep.equal({ foo: "bar" });
        expect(listener.called).to.be["false"];

        this.setState({ foo: "bar" });
        this.replaceState({ baz: "foo" });
      });

      // Simulate dispatch
      store.handler({ actionId: actionId, body: "foobar" });

      expect(listener.calledOnce).to.be["true"];
      expect(store.state).to.deep.equal({ baz: "foo" });
    });

    it("emits change event", function () {
      var store = new ExampleStore();
      var listener = sinon.spy();
      store.addListener("change", listener);

      store.replaceState({ foo: "bar" });

      expect(listener.calledOnce).to.be["true"];
    });
  });

  describe(".assignState", function () {
    it("can be overridden to enable custom state types", function () {
      var StringStore = (function (_Store2) {
        function StringStore() {
          _classCallCheck(this, StringStore);

          if (_Store2 != null) {
            _Store2.apply(this, arguments);
          }
        }

        _inherits(StringStore, _Store2);

        _createClass(StringStore, null, {
          assignState: {
            value: function assignState(prevState, nextState) {
              return [prevState, nextState].filter(function (state) {
                return typeof state === "string";
              }).join("");
            }
          }
        });

        return StringStore;
      })(Store);

      var store = new StringStore();

      expect(store.state).to.be["null"];
      store.setState("a");
      expect(store.state).to.equal("a");
      store.setState("b");
      expect(store.state).to.equal("ab");
      store.replaceState("xyz");
      expect(store.state).to.equal("xyz");
      store.setState("zyx");
      expect(store.state).to.equal("xyzzyx");
    });
  });

  describe("#getStateAsObject()", function () {
    it("returns the current state as an object", function () {
      var store = new Store();
      store.setState({ foo: "bar", bar: "baz" });
      expect(store.getStateAsObject()).to.deep.equal({ foo: "bar", bar: "baz" });
    });
  });

  describe("#forceUpdate()", function () {
    it("emits change event", function () {
      var store = new ExampleStore();
      var listener = sinon.spy();
      store.addListener("change", listener);

      store.forceUpdate();

      expect(listener.calledOnce).to.be["true"];
    });

    it("doesn't modify existing state", function () {
      var store = new ExampleStore();
      var listener = sinon.spy();
      store.addListener("change", listener);

      store.register(actionId, function () {
        this.replaceState({ bar: "baz" });
        this.forceUpdate();

        expect(this.state).to.deep.equal({ foo: "bar" });
        expect(listener.called).to.be["false"];

        this.setState({ foo: "bar" });
        this.forceUpdate();
        this.replaceState({ baz: "foo" });
      });

      // Simulate dispatch
      store.handler({ actionId: actionId, body: "foobar" });

      expect(listener.calledOnce).to.be["true"];
      expect(store.state).to.deep.equal({ baz: "foo" });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9fX3Rlc3RzX18vU3RvcmUtdGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBQXFDLFNBQVM7O0lBQXJDLEtBQUssU0FBTCxLQUFLO0lBQUUsSUFBSSxTQUFKLElBQUk7SUFBRSxPQUFPLFNBQVAsT0FBTzs7SUFDdEIsS0FBSywyQkFBTSxPQUFPOztBQUV6QixRQUFRLENBQUMsT0FBTyxFQUFFLFlBQU07TUFDaEIsWUFBWTtBQUNMLGFBRFAsWUFBWSxHQUNGOzRCQURWLFlBQVk7O0FBRWQsaUNBRkUsWUFBWSw2Q0FFTjtBQUNSLFVBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUM7S0FDN0I7O2NBSkcsWUFBWTs7V0FBWixZQUFZO0tBQVMsS0FBSzs7QUFPaEMsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDOztBQUU1QixVQUFRLENBQUMsYUFBYSxFQUFFLFlBQU07QUFDNUIsTUFBRSxDQUFDLGlEQUFpRCxFQUFFLFlBQU07OztBQUMxRCxVQUFNLEtBQUssR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0FBQ2pDLFVBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUM1QixXQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFbEMsVUFBTSxRQUFRLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDaEMsMEJBQUEsS0FBSyxDQUFDLFNBQVMsRUFBQyxRQUFRLE9BQUMsbUJBQUksUUFBUSxDQUFDLENBQUM7O0FBRXZDLFlBQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxNQUFBLENBQWxCLE9BQU8sRUFBZSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQUssQ0FBQztLQUNwRCxDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLHdCQUF3QixFQUFFLFlBQU07QUFDakMsVUFBTSxLQUFLLEdB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LEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztPQUNuQyxDQUFDLENBQUM7OztBQUdILFdBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDOztBQUU1QyxZQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQUssQ0FBQztBQUN2QyxZQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7S0FDbkQsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBRUosQ0FBQyxDQUFDIiwiZmlsZSI6InNyYy9fX3Rlc3RzX18vU3RvcmUtdGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0b3JlLCBGbHV4LCBBY3Rpb25zIH0gZnJvbSAnLi4vRmx1eCc7XG5pbXBvcnQgc2lub24gZnJvbSAnc2lub24nO1xuXG5kZXNjcmliZSgnU3RvcmUnLCAoKSA9PiB7XG4gIGNsYXNzIEV4YW1wbGVTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnN0YXRlID0geyBmb286ICdiYXInIH07XG4gICAgfVxuICB9XG5cbiAgY29uc3QgYWN0aW9uSWQgPSAnYWN0aW9uSWQnO1xuXG4gIGRlc2NyaWJlKCcjcmVnaXN0ZXIoKScsICgpID0+IHtcbiAgICBpdCgnYWRkcyBoYW5kbGVyIHRvIGludGVybmFsIGNvbGxlY3Rpb24gb2YgaGFuZGxlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG5ldyBFeGFtcGxlU3RvcmUoKTtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBzaW5vbi5zcHkoKTtcbiAgICAgIHN0b3JlLnJlZ2lzdGVyKGFjdGlvbklkLCBoYW5kbGVyKTtcblxuICAgICAgY29uc3QgbW9ja0FyZ3MgPSBbJ2ZvbycsICdiYXInXTtcbiAgICAgIHN0b3JlLl9oYW5kbGVyc1thY3Rpb25JZF0oLi4ubW9ja0FyZ3MpO1xuXG4gICAgICBleHBlY3QoaGFuZGxlci5jYWxsZWRXaXRoKC4uLm1vY2tBcmdzKSkudG8uYmUudHJ1ZTtcbiAgICB9KTtcblxuICAgIGl0KCdiaW5kcyBoYW5kbGVyIHRvIHN0b3JlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgRXhhbXBsZVN0b3JlKCk7XG4gICAgICBzdG9yZS5mb28gPSAnYmFyJztcblxuICAgICAgZnVuY3Rpb24gaGFuZGxlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9vO1xuICAgICAgfVxuXG4gICAgICBzdG9yZS5yZWdpc3RlcihhY3Rpb25JZCwgaGFuZGxlcik7XG5cbiAgICAgIGV4cGVjdChzdG9yZS5faGFuZGxlcnNbYWN0aW9uSWRdKCkpLnRvLmVxdWFsKCdiYXInKTtcbiAgICB9KTtcblxuICAgIGl0KCdhY2NlcHRzIGFjdGlvbnMgaW5zdGVhZCBvZiBhY3Rpb24gaWRzJywgKCkgPT4ge1xuICAgICAgY2xhc3MgRXhhbXBsZUFjdGlvbnMgZXh0ZW5kcyBBY3Rpb25zIHtcbiAgICAgICAgZ2V0Rm9vKCkge1xuICAgICAgICAgIHJldHVybiAnZm9vJztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBhY3Rpb25zID0gbmV3IEV4YW1wbGVBY3Rpb25zKCk7XG4gICAgICBjb25zdCBzdG9yZSA9IG5ldyBFeGFtcGxlU3RvcmUoKTtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBzaW5vbi5zcHkoKTtcbiAgICAgIHN0b3JlLnJlZ2lzdGVyKGFjdGlvbnMuZ2V0Rm9vLCBoYW5kbGVyKTtcblxuICAgICAgY29uc3QgbW9ja0FyZ3MgPSBbJ2ZvbycsICdiYXInXTtcbiAgICAgIHN0b3JlLl9oYW5kbGVyc1thY3Rpb25zLmdldEZvby5faWRdKC4uLm1vY2tBcmdzKTtcblxuICAgICAgZXhwZWN0KGhhbmRsZXIuY2FsbGVkV2l0aCguLi5tb2NrQXJncykpLnRvLmJlLnRydWU7XG4gICAgfSk7XG5cbiAgICBpdCgnaWdub3JlcyBub24tZnVuY3Rpb24gaGFuZGxlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG5ldyBFeGFtcGxlU3RvcmUoKTtcbiAgICAgIGV4cGVjdChzdG9yZS5yZWdpc3Rlci5iaW5kKHN0b3JlLCBudWxsKSkubm90LnRvLnRocm93KCk7XG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgaXQoJ2RlZmF1bHQgc3RhdGUgaXMgbnVsbCcsICgpID0+IHtcbiAgICBjb25zdCBzdG9yZSA9IG5ldyBTdG9yZSgpO1xuICAgIGV4cGVjdChzdG9yZS5zdGF0ZSkudG8uYmUubnVsbDtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNyZWdpc3RlckFzeW5jKCknLCAoKSA9PiB7XG4gICAgaXQoJ3JlZ2lzdGVycyBoYW5kbGVycyBmb3IgYmVnaW4sIHN1Y2Nlc3MsIGFuZCBmYWlsdXJlIG9mIGFzeW5jIGFjdGlvbicsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoKTtcblxuICAgICAgY2xhc3MgRXhhbXBsZUFjdGlvbnMgZXh0ZW5kcyBBY3Rpb25zIHtcbiAgICAgICAgYXN5bmMgZ2V0Rm9vKG1lc3NhZ2UsIF9zdWNjZXNzID0gdHJ1ZSkge1xuICAgICAgICAgIGlmICghX3N1Y2Nlc3MpIHRocm93IGVycm9yO1xuXG4gICAgICAgICAgcmV0dXJuIG1lc3NhZ2UgKyAnIHN1Y2Nlc3MnO1xuICAgICAgICB9XG5cbiAgICAgICAgYXN5bmMgZ2V0QmFyKG1lc3NhZ2UpIHtcbiAgICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjbGFzcyBFeGFtcGxlRmx1eCBleHRlbmRzIEZsdXgge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgIHRoaXMuY3JlYXRlQWN0aW9ucygnZXhhbXBsZScsIEV4YW1wbGVBY3Rpb25zKTtcbiAgICAgICAgICB0aGlzLmNyZWF0ZVN0b3JlKCdleGFtcGxlJywgRXhhbXBsZVN0b3JlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEV4YW1wbGVGbHV4KCk7XG4gICAgICBjb25zdCBhY3Rpb25zID0gZmx1eC5nZXRBY3Rpb25zKCdleGFtcGxlJyk7XG4gICAgICBjb25zdCBzdG9yZSA9IGZsdXguZ2V0U3RvcmUoJ2V4YW1wbGUnKTtcblxuICAgICAgY29uc3QgaGFuZGxlciA9IHNpbm9uLnNweSgpO1xuICAgICAgc3RvcmUucmVnaXN0ZXIoYWN0aW9ucy5nZXRCYXIsIGhhbmRsZXIpO1xuXG4gICAgICBhd2FpdCBhY3Rpb25zLmdldEJhcignYmFyJyk7XG4gICAgICBleHBlY3QoaGFuZGxlci5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KGhhbmRsZXIuZmlyc3RDYWxsLmFyZ3MpLnRvLmRlZXAuZXF1YWwoWydiYXInXSk7XG5cbiAgICAgIGNvbnN0IGJlZ2luID0gc2lub24uc3B5KCk7XG4gICAgICBjb25zdCBzdWNjZXNzID0gc2lub24uc3B5KCk7XG4gICAgICBjb25zdCBmYWlsdXJlID0gc2lub24uc3B5KCk7XG4gICAgICBzdG9yZS5yZWdpc3RlckFzeW5jKGFjdGlvbnMuZ2V0Rm9vLCBiZWdpbiwgc3VjY2VzcywgZmFpbHVyZSk7XG5cbiAgICAgIGF3YWl0IGFjdGlvbnMuZ2V0Rm9vKCdmb28nLCB0cnVlKTtcbiAgICAgIGV4cGVjdChiZWdpbi5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KGJlZ2luLmZpcnN0Q2FsbC5hcmdzKS50by5kZWVwLmVxdWFsKFsnZm9vJywgdHJ1ZV0pO1xuICAgICAgZXhwZWN0KHN1Y2Nlc3MuY2FsbGVkT25jZSkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChzdWNjZXNzLmZpcnN0Q2FsbC5hcmdzWzBdKS50by5lcXVhbCgnZm9vIHN1Y2Nlc3MnKTtcbiAgICAgIGV4cGVjdChmYWlsdXJlLmNhbGxlZCkudG8uYmUuZmFsc2U7XG5cbiAgICAgIGF3YWl0IGV4cGVjdChhY3Rpb25zLmdldEZvbygnYmFyJywgZmFsc2UpKS50by5iZS5yZWplY3RlZDtcblxuICAgICAgZXhwZWN0KGJlZ2luLmNhbGxlZFR3aWNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KHN1Y2Nlc3MuY2FsbGVkT25jZSkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChmYWlsdXJlLmNhbGxlZE9uY2UpLnRvLmJlLnRydWU7XG4gICAgICBleHBlY3QoZmFpbHVyZS5maXJzdENhbGwuYXJnc1swXSkudG8uZXF1YWwoZXJyb3IpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2lnbm9yZXMgbm9uLWZ1bmN0aW9uIGhhbmRsZXJzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgRXhhbXBsZVN0b3JlKCk7XG4gICAgICBleHBlY3Qoc3RvcmUucmVnaXN0ZXJBc3luYy5iaW5kKHN0b3JlLCBudWxsKSkubm90LnRvLnRocm93KCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjcmVnaXN0ZXJBbGwoKScsICgpID0+IHtcbiAgICBpdCgnYWRkcyBoYW5kbGVyIHRvIGludGVybmFsIGNvbGxlY3Rpb24gb2YgXCJjYXRjaCBhbGxcIiBoYW5kbGVycycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gbmV3IEV4YW1wbGVTdG9yZSgpO1xuICAgICAgY29uc3QgaGFuZGxlciA9IHNpbm9uLnNweSgpO1xuICAgICAgc3RvcmUucmVnaXN0ZXJBbGwoaGFuZGxlcik7XG5cbiAgICAgIGNvbnN0IG1vY2tBcmdzID0gWydmb28nLCAnYmFyJ107XG4gICAgICBzdG9yZS5fY2F0Y2hBbGxIYW5kbGVyc1swXSguLi5tb2NrQXJncyk7XG5cbiAgICAgIGV4cGVjdChoYW5kbGVyLmNhbGxlZFdpdGgoLi4ubW9ja0FyZ3MpKS50by5iZS50cnVlO1xuICAgIH0pO1xuXG4gICAgaXQoJ2FkZHMgbXVsdGlwbGUgaGFuZGxlcnMgdG8gaW50ZXJuYWwgY29sbGVjdGlvbiBvZiBcImNhdGNoIGFsbFwiIGhhbmRsZXJzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgRXhhbXBsZVN0b3JlKCk7XG4gICAgICBjb25zdCBoYW5kbGVyMSA9IHNpbm9uLnNweSgpO1xuICAgICAgY29uc3QgaGFuZGxlcjIgPSBzaW5vbi5zcHkoKTtcbiAgICAgIHN0b3JlLnJlZ2lzdGVyQWxsKGhhbmRsZXIxKTtcbiAgICAgIHN0b3JlLnJlZ2lzdGVyQWxsKGhhbmRsZXIyKTtcblxuICAgICAgY29uc3QgbW9ja0FyZ3MgPSBbJ2ZvbycsICdiYXInXTtcbiAgICAgIHN0b3JlLl9jYXRjaEFsbEhhbmRsZXJzWzBdKC4uLm1vY2tBcmdzKTtcbiAgICAgIHN0b3JlLl9jYXRjaEFsbEhhbmRsZXJzWzFdKC4uLm1vY2tBcmdzKTtcblxuICAgICAgZXhwZWN0KGhhbmRsZXIxLmNhbGxlZFdpdGgoLi4ubW9ja0FyZ3MpKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KGhhbmRsZXIyLmNhbGxlZFdpdGgoLi4ubW9ja0FyZ3MpKS50by5iZS50cnVlO1xuICAgIH0pO1xuXG4gICAgaXQoJ2JpbmRzIGhhbmRsZXIgdG8gc3RvcmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG5ldyBFeGFtcGxlU3RvcmUoKTtcbiAgICAgIHN0b3JlLmZvbyA9ICdiYXInO1xuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mb287XG4gICAgICB9XG5cbiAgICAgIHN0b3JlLnJlZ2lzdGVyQWxsKGhhbmRsZXIpO1xuXG4gICAgICBleHBlY3Qoc3RvcmUuX2NhdGNoQWxsSGFuZGxlcnNbMF0oKSkudG8uZXF1YWwoJ2JhcicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2FjY2VwdHMgYWN0aW9ucyBpbnN0ZWFkIG9mIGFjdGlvbiBpZHMnLCAoKSA9PiB7XG4gICAgICBjbGFzcyBFeGFtcGxlQWN0aW9ucyBleHRlbmRzIEFjdGlvbnMge1xuICAgICAgICBnZXRGb28oKSB7XG4gICAgICAgICAgcmV0dXJuICdmb28nO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFjdGlvbnMgPSBuZXcgRXhhbXBsZUFjdGlvbnMoKTtcbiAgICAgIGNvbnN0IHN0b3JlID0gbmV3IEV4YW1wbGVTdG9yZSgpO1xuICAgICAgY29uc3QgaGFuZGxlciA9IHNpbm9uLnNweSgpO1xuICAgICAgc3RvcmUucmVnaXN0ZXJBbGwoaGFuZGxlcik7XG5cbiAgICAgIGNvbnN0IG1vY2tBcmdzID0gWydmb28nLCAnYmFyJ107XG4gICAgICBzdG9yZS5fY2F0Y2hBbGxIYW5kbGVyc1swXSguLi5tb2NrQXJncyk7XG5cbiAgICAgIGV4cGVjdChoYW5kbGVyLmNhbGxlZFdpdGgoLi4ubW9ja0FyZ3MpKS50by5iZS50cnVlO1xuICAgIH0pO1xuXG4gICAgaXQoJ2lnbm9yZXMgbm9uLWZ1bmN0aW9uIGhhbmRsZXJzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgRXhhbXBsZVN0b3JlKCk7XG4gICAgICBleHBlY3Qoc3RvcmUucmVnaXN0ZXJBbGwuYmluZChzdG9yZSwgbnVsbCkpLm5vdC50by50aHJvdygpO1xuICAgIH0pO1xuXG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjcmVnaXN0ZXJBbGxBc3luYygpJywgKCkgPT4ge1xuICAgIGl0KCdyZWdpc3RlcnMgXCJjYXRjaCBhbGxcIiBoYW5kbGVycyBmb3IgYmVnaW4sIHN1Y2Nlc3MsIGFuZCBmYWlsdXJlIG9mIGFzeW5jIGFjdGlvbicsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoKTtcblxuICAgICAgY2xhc3MgRXhhbXBsZUFjdGlvbnMgZXh0ZW5kcyBBY3Rpb25zIHtcbiAgICAgICAgYXN5bmMgZ2V0Rm9vKG1lc3NhZ2UsIF9zdWNjZXNzID0gdHJ1ZSkge1xuICAgICAgICAgIGlmICghX3N1Y2Nlc3MpIHRocm93IGVycm9yO1xuXG4gICAgICAgICAgcmV0dXJuIG1lc3NhZ2UgKyAnIHN1Y2Nlc3MnO1xuICAgICAgICB9XG5cbiAgICAgICAgYXN5bmMgZ2V0QmFyKG1lc3NhZ2UsIF9zdWNjZXNzID0gdHJ1ZSkge1xuICAgICAgICAgIGlmICghX3N1Y2Nlc3MpIHRocm93IGVycm9yO1xuXG4gICAgICAgICAgcmV0dXJuIG1lc3NhZ2UgKyAnIHN1Y2Nlc3MnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNsYXNzIEV4YW1wbGVGbHV4IGV4dGVuZHMgRmx1eCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgdGhpcy5jcmVhdGVBY3Rpb25zKCdleGFtcGxlJywgRXhhbXBsZUFjdGlvbnMpO1xuICAgICAgICAgIHRoaXMuY3JlYXRlU3RvcmUoJ2V4YW1wbGUnLCBFeGFtcGxlU3RvcmUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRXhhbXBsZUZsdXgoKTtcbiAgICAgIGNvbnN0IGFjdGlvbnMgPSBmbHV4LmdldEFjdGlvbnMoJ2V4YW1wbGUnKTtcbiAgICAgIGNvbnN0IHN0b3JlID0gZmx1eC5nZXRTdG9yZSgnZXhhbXBsZScpO1xuXG4gICAgICBjb25zdCBiZWdpbiA9IHNpbm9uLnNweSgpO1xuICAgICAgY29uc3Qgc3VjY2VzcyA9IHNpbm9uLnNweSgpO1xuICAgICAgY29uc3QgZmFpbHVyZSA9IHNpbm9uLnNweSgpO1xuICAgICAgc3RvcmUucmVnaXN0ZXJBbGxBc3luYyhiZWdpbiwgc3VjY2VzcywgZmFpbHVyZSk7XG5cbiAgICAgIGF3YWl0IGFjdGlvbnMuZ2V0Rm9vKCdmb28nLCB0cnVlKTtcbiAgICAgIGV4cGVjdChiZWdpbi5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KGJlZ2luLmZpcnN0Q2FsbC5hcmdzKS50by5kZWVwLmVxdWFsKFsnZm9vJywgdHJ1ZV0pO1xuICAgICAgZXhwZWN0KHN1Y2Nlc3MuY2FsbGVkT25jZSkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChzdWNjZXNzLmZpcnN0Q2FsbC5hcmdzWzBdKS50by5lcXVhbCgnZm9vIHN1Y2Nlc3MnKTtcbiAgICAgIGV4cGVjdChmYWlsdXJlLmNhbGxlZCkudG8uYmUuZmFsc2U7XG5cbiAgICAgIGF3YWl0IGV4cGVjdChhY3Rpb25zLmdldEZvbygnYmFyJywgZmFsc2UpKS50by5iZS5yZWplY3RlZDtcbiAgICAgIGV4cGVjdChiZWdpbi5jYWxsZWRUd2ljZSkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChzdWNjZXNzLmNhbGxlZE9uY2UpLnRvLmJlLnRydWU7XG4gICAgICBleHBlY3QoZmFpbHVyZS5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KGZhaWx1cmUuZmlyc3RDYWxsLmFyZ3NbMF0pLnRvLmVxdWFsKGVycm9yKTtcblxuICAgICAgYXdhaXQgYWN0aW9ucy5nZXRCYXIoJ2ZvbycsIHRydWUpO1xuICAgICAgZXhwZWN0KGJlZ2luLmNhbGxlZFRocmljZSkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChiZWdpbi50aGlyZENhbGwuYXJncykudG8uZGVlcC5lcXVhbChbJ2ZvbycsIHRydWVdKTtcbiAgICAgIGV4cGVjdChzdWNjZXNzLmNhbGxlZFR3aWNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KHN1Y2Nlc3Muc2Vjb25kQ2FsbC5hcmdzWzBdKS50by5lcXVhbCgnZm9vIHN1Y2Nlc3MnKTtcbiAgICAgIGV4cGVjdChmYWlsdXJlLmNhbGxlZFR3aWNlKS50by5iZS5mYWxzZTtcblxuICAgICAgYXdhaXQgZXhwZWN0KGFjdGlvbnMuZ2V0QmFyKCdiYXInLCBmYWxzZSkpLnRvLmJlLnJlamVjdGVkO1xuICAgICAgZXhwZWN0KGJlZ2luLmNhbGxDb3VudCkudG8uZXF1YWwoNCk7XG4gICAgICBleHBlY3Qoc3VjY2Vzcy5jYWxsZWRUd2ljZSkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChmYWlsdXJlLmNhbGxlZFR3aWNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KGZhaWx1cmUuc2Vjb25kQ2FsbC5hcmdzWzBdKS50by5lcXVhbChlcnJvcik7XG4gICAgfSk7XG5cbiAgICBpdCgnaWdub3JlcyBub24tZnVuY3Rpb24gaGFuZGxlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG5ldyBFeGFtcGxlU3RvcmUoKTtcbiAgICAgIGV4cGVjdChzdG9yZS5yZWdpc3RlckFzeW5jLmJpbmQoc3RvcmUsIG51bGwpKS5ub3QudG8udGhyb3coKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNoYW5kbGVyKCknLCAoKSA9PiB7XG4gICAgaXQoJ2RlbGVnYXRlcyBkaXNwYXRjaGVzIHRvIHJlZ2lzdGVyZWQgaGFuZGxlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG5ldyBFeGFtcGxlU3RvcmUoKTtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBzaW5vbi5zcHkoKTtcbiAgICAgIHN0b3JlLnJlZ2lzdGVyKGFjdGlvbklkLCBoYW5kbGVyKTtcblxuICAgICAgLy8gU2ltdWxhdGUgZGlzcGF0Y2hcbiAgICAgIGNvbnN0IGJvZHkgPSB7IGZvbzogJ2JhcicgfTtcbiAgICAgIHN0b3JlLmhhbmRsZXIoeyBib2R5LCBhY3Rpb25JZCB9KTtcblxuICAgICAgZXhwZWN0KGhhbmRsZXIuY2FsbGVkV2l0aChib2R5KSkudG8uYmUudHJ1ZTtcbiAgICB9KTtcblxuICAgIGl0KCdkZWxlZ2F0ZXMgZGlzcGF0Y2hlcyB0byByZWdpc3RlcmVkIFwiY2F0Y2ggYWxsXCIgaGFuZGxlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG5ldyBFeGFtcGxlU3RvcmUoKTtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBzaW5vbi5zcHkoKTtcbiAgICAgIGNvbnN0IGFjdGlvbklkcyA9IFsnYWN0aW9uSWQxJywgJ2FjdGlvbklkMiddO1xuICAgICAgc3RvcmUucmVnaXN0ZXJBbGwoaGFuZGxlcik7XG5cbiAgICAgIC8vIFNpbXVsYXRlIGRpc3BhdGNoXG4gICAgICBjb25zdCBib2R5ID0geyBmb286ICdiYXInIH07XG4gICAgICBzdG9yZS5oYW5kbGVyKHsgYm9keSwgYWN0aW9uSWQ6IGFjdGlvbklkc1swXSB9KTtcbiAgICAgIHN0b3JlLmhhbmRsZXIoeyBib2R5LCBhY3Rpb25JZDogYWN0aW9uSWRzWzFdIH0pO1xuXG4gICAgICBleHBlY3QoaGFuZGxlci5jYWxsZWRXaXRoKGJvZHkpKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KGhhbmRsZXIuY2FsbGVkVHdpY2UpLnRvLmJlLnRydWU7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjd2FpdEZvcigpJywgKCkgPT4ge1xuICAgIGl0KCd3YWl0cyBmb3Igb3RoZXIgc3RvcmVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgICBjb25zdCByZXN1bHQgPSBbXTtcblxuICAgICAgbGV0IHN0b3JlMjtcblxuICAgICAgY2xhc3MgU3RvcmUxIGV4dGVuZHMgU3RvcmUge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgICAgdGhpcy5yZWdpc3RlcihhY3Rpb25JZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLndhaXRGb3Ioc3RvcmUyKTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKDEpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNsYXNzIFN0b3JlMiBleHRlbmRzIFN0b3JlIHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAgIHRoaXMucmVnaXN0ZXIoYWN0aW9uSWQsICgpID0+IHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKDIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZsdXguY3JlYXRlU3RvcmUoJ3N0b3JlMScsIFN0b3JlMSk7XG4gICAgICBmbHV4LmNyZWF0ZVN0b3JlKCdzdG9yZTInLCBTdG9yZTIpO1xuXG4gICAgICBzdG9yZTIgPSBmbHV4LmdldFN0b3JlKCdzdG9yZTInKTtcblxuICAgICAgZmx1eC5kaXNwYXRjaChhY3Rpb25JZCwgJ2Zvb2JhcicpO1xuXG4gICAgICBleHBlY3QocmVzdWx0KS50by5kZWVwLmVxdWFsKFsyLCAxXSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjZm9yY2VVcGRhdGUoKScsICgpID0+IHtcbiAgICBpdCgnZW1pdHMgY2hhbmdlIGV2ZW50JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgRXhhbXBsZVN0b3JlKCk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IHNpbm9uLnNweSgpO1xuICAgICAgc3RvcmUuYWRkTGlzdGVuZXIoJ2NoYW5nZScsIGxpc3RlbmVyKTtcblxuICAgICAgc3RvcmUuZm9yY2VVcGRhdGUoKTtcblxuICAgICAgZXhwZWN0KGxpc3RlbmVyLmNhbGxlZE9uY2UpLnRvLmJlLnRydWU7XG4gICAgfSk7XG5cbiAgICBpdCgnZG9lc25cXCd0IG1vZGlmeSBleGlzdGluZyBzdGF0ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gbmV3IEV4YW1wbGVTdG9yZSgpO1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSBzaW5vbi5zcHkoKTtcbiAgICAgIHN0b3JlLmFkZExpc3RlbmVyKCdjaGFuZ2UnLCBsaXN0ZW5lcik7XG5cbiAgICAgIHN0b3JlLnJlZ2lzdGVyKGFjdGlvbklkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5yZXBsYWNlU3RhdGUoeyBiYXI6ICdiYXonIH0pO1xuICAgICAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XG5cbiAgICAgICAgZXhwZWN0KHRoaXMuc3RhdGUpLnRvLmRlZXAuZXF1YWwoeyBmb286ICdiYXInIH0pO1xuICAgICAgICBleHBlY3QobGlzdGVuZXIuY2FsbGVkKS50by5iZS5mYWxzZTtcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgZm9vOiAnYmFyJyB9KTtcbiAgICAgICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICAgICAgICB0aGlzLnJlcGxhY2VTdGF0ZSh7IGJhejogJ2ZvbycgfSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gU2ltdWxhdGUgZGlzcGF0Y2hcbiAgICAgIHN0b3JlLmhhbmRsZXIoeyBhY3Rpb25JZCwgYm9keTogJ2Zvb2JhcicgfSk7XG5cbiAgICAgIGV4cGVjdChsaXN0ZW5lci5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KHN0b3JlLnN0YXRlKS50by5kZWVwLmVxdWFsKHsgYmF6OiAnZm9vJyB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNzZXRTdGF0ZSgpJywgKCkgPT4ge1xuICAgIGl0KCdzaGFsbG93IG1lcmdlcyBvbGQgc3RhdGUgd2l0aCBuZXcgc3RhdGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG5ldyBFeGFtcGxlU3RvcmUoKTtcblxuICAgICAgc3RvcmUuc2V0U3RhdGUoeyBiYXI6ICdiYXonIH0pO1xuXG4gICAgICBleHBlY3Qoc3RvcmUuc3RhdGUpLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBmb286ICdiYXInLFxuICAgICAgICBiYXI6ICdiYXonLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc3VwcG9ydHMgdHJhbnNhY3Rpb25hbCB1cGRhdGVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgU3RvcmUoKTtcbiAgICAgIHN0b3JlLnN0YXRlID0geyBhOiAxIH07XG4gICAgICBzdG9yZS5zZXRTdGF0ZShzdGF0ZSA9PiAoeyBhOiBzdGF0ZS5hICsgMSB9KSk7XG4gICAgICBleHBlY3Qoc3RvcmUuc3RhdGUuYSkudG8uZXF1YWwoMik7XG4gICAgICBzdG9yZS5zZXRTdGF0ZShzdGF0ZSA9PiAoeyBhOiBzdGF0ZS5hICsgMSB9KSk7XG4gICAgICBleHBlY3Qoc3RvcmUuc3RhdGUuYSkudG8uZXF1YWwoMyk7XG4gICAgICBzdG9yZS5zZXRTdGF0ZShzdGF0ZSA9PiAoeyBhOiBzdGF0ZS5hICsgMSB9KSk7XG4gICAgICBleHBlY3Qoc3RvcmUuc3RhdGUuYSkudG8uZXF1YWwoNCk7XG4gICAgfSk7XG5cbiAgICBpdCgnZW1pdHMgY2hhbmdlIGV2ZW50JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgRXhhbXBsZVN0b3JlKCk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IHNpbm9uLnNweSgpO1xuICAgICAgc3RvcmUuYWRkTGlzdGVuZXIoJ2NoYW5nZScsIGxpc3RlbmVyKTtcblxuICAgICAgc3RvcmUuc2V0U3RhdGUoeyBmb286ICdiYXInIH0pO1xuXG4gICAgICBleHBlY3QobGlzdGVuZXIuY2FsbGVkT25jZSkudG8uYmUudHJ1ZTtcbiAgICB9KTtcblxuICAgIGl0KCdiYXRjaGVzIG11bHRpcGxlIHN0YXRlIHVwZGF0ZXMgd2l0aGluIGFjdGlvbiBoYW5kbGVyJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgRXhhbXBsZVN0b3JlKCk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IHNpbm9uLnNweSgpO1xuICAgICAgc3RvcmUuYWRkTGlzdGVuZXIoJ2NoYW5nZScsIGxpc3RlbmVyKTtcblxuICAgICAgc3RvcmUucmVnaXN0ZXIoYWN0aW9uSWQsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgYmFyOiAnYmF6JyB9KTtcblxuICAgICAgICBleHBlY3QodGhpcy5zdGF0ZSkudG8uZGVlcC5lcXVhbCh7IGZvbzogJ2JhcicgfSk7XG4gICAgICAgIGV4cGVjdChsaXN0ZW5lci5jYWxsZWQpLnRvLmJlLmZhbHNlO1xuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBiYXo6ICdmb28nIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFNpbXVsYXRlIGRpc3BhdGNoXG4gICAgICBzdG9yZS5oYW5kbGVyKHsgYWN0aW9uSWQsIGJvZHk6ICdmb29iYXInIH0pO1xuXG4gICAgICBleHBlY3QobGlzdGVuZXIuY2FsbGVkT25jZSkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChzdG9yZS5zdGF0ZSkudG8uZGVlcC5lcXVhbCh7IGZvbzogJ2JhcicsIGJhcjogJ2JheicsIGJhejogJ2ZvbycgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjcmVwbGFjZVN0YXRlKCknLCAoKSA9PiB7XG4gICAgaXQoJ3JlcGxhY2VzIG9sZCBzdGF0ZSB3aXRoIG5ldyBzdGF0ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gbmV3IEV4YW1wbGVTdG9yZSgpO1xuXG4gICAgICBzdG9yZS5yZXBsYWNlU3RhdGUoeyBiYXI6ICdiYXonIH0pO1xuXG4gICAgICBleHBlY3Qoc3RvcmUuc3RhdGUpLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBiYXI6ICdiYXonLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnYmF0Y2hlcyBtdWx0aXBsZSBzdGF0ZSB1cGRhdGVzIHdpdGhpbiBhY3Rpb24gaGFuZGxlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gbmV3IEV4YW1wbGVTdG9yZSgpO1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSBzaW5vbi5zcHkoKTtcbiAgICAgIHN0b3JlLmFkZExpc3RlbmVyKCdjaGFuZ2UnLCBsaXN0ZW5lcik7XG5cbiAgICAgIHN0b3JlLnJlZ2lzdGVyKGFjdGlvbklkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5yZXBsYWNlU3RhdGUoeyBiYXI6ICdiYXonIH0pO1xuXG4gICAgICAgIGV4cGVjdCh0aGlzLnN0YXRlKS50by5kZWVwLmVxdWFsKHsgZm9vOiAnYmFyJyB9KTtcbiAgICAgICAgZXhwZWN0KGxpc3RlbmVyLmNhbGxlZCkudG8uYmUuZmFsc2U7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGZvbzogJ2JhcicgfSk7XG4gICAgICAgIHRoaXMucmVwbGFjZVN0YXRlKHsgYmF6OiAnZm9vJyB9KTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBTaW11bGF0ZSBkaXNwYXRjaFxuICAgICAgc3RvcmUuaGFuZGxlcih7IGFjdGlvbklkLCBib2R5OiAnZm9vYmFyJyB9KTtcblxuICAgICAgZXhwZWN0KGxpc3RlbmVyLmNhbGxlZE9uY2UpLnRvLmJlLnRydWU7XG4gICAgICBleHBlY3Qoc3RvcmUuc3RhdGUpLnRvLmRlZXAuZXF1YWwoeyBiYXo6ICdmb28nIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2VtaXRzIGNoYW5nZSBldmVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gbmV3IEV4YW1wbGVTdG9yZSgpO1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSBzaW5vbi5zcHkoKTtcbiAgICAgIHN0b3JlLmFkZExpc3RlbmVyKCdjaGFuZ2UnLCBsaXN0ZW5lcik7XG5cbiAgICAgIHN0b3JlLnJlcGxhY2VTdGF0ZSh7IGZvbzogJ2JhcicgfSk7XG5cbiAgICAgIGV4cGVjdChsaXN0ZW5lci5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnLmFzc2lnblN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdjYW4gYmUgb3ZlcnJpZGRlbiB0byBlbmFibGUgY3VzdG9tIHN0YXRlIHR5cGVzJywgKCkgPT4ge1xuICAgICAgY2xhc3MgU3RyaW5nU3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgICAgIHN0YXRpYyBhc3NpZ25TdGF0ZShwcmV2U3RhdGUsIG5leHRTdGF0ZSkge1xuICAgICAgICAgIHJldHVybiBbcHJldlN0YXRlLCBuZXh0U3RhdGVdXG4gICAgICAgICAgICAuZmlsdGVyKHN0YXRlID0+IHR5cGVvZiBzdGF0ZSA9PT0gJ3N0cmluZycpXG4gICAgICAgICAgICAuam9pbignJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgU3RyaW5nU3RvcmUoKTtcblxuICAgICAgZXhwZWN0KHN0b3JlLnN0YXRlKS50by5iZS5udWxsO1xuICAgICAgc3RvcmUuc2V0U3RhdGUoJ2EnKTtcbiAgICAgIGV4cGVjdChzdG9yZS5zdGF0ZSkudG8uZXF1YWwoJ2EnKTtcbiAgICAgIHN0b3JlLnNldFN0YXRlKCdiJyk7XG4gICAgICBleHBlY3Qoc3RvcmUuc3RhdGUpLnRvLmVxdWFsKCdhYicpO1xuICAgICAgc3RvcmUucmVwbGFjZVN0YXRlKCd4eXonKTtcbiAgICAgIGV4cGVjdChzdG9yZS5zdGF0ZSkudG8uZXF1YWwoJ3h5eicpO1xuICAgICAgc3RvcmUuc2V0U3RhdGUoJ3p5eCcpO1xuICAgICAgZXhwZWN0KHN0b3JlLnN0YXRlKS50by5lcXVhbCgneHl6enl4Jyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjZ2V0U3RhdGVBc09iamVjdCgpJywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIHRoZSBjdXJyZW50IHN0YXRlIGFzIGFuIG9iamVjdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gbmV3IFN0b3JlKCk7XG4gICAgICBzdG9yZS5zZXRTdGF0ZSh7IGZvbzogJ2JhcicsIGJhcjogJ2JheicgfSk7XG4gICAgICBleHBlY3Qoc3RvcmUuZ2V0U3RhdGVBc09iamVjdCgpKS50by5kZWVwLmVxdWFsKHsgZm9vOiAnYmFyJywgYmFyOiAnYmF6JyB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNmb3JjZVVwZGF0ZSgpJywgKCkgPT4ge1xuICAgIGl0KCdlbWl0cyBjaGFuZ2UgZXZlbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG5ldyBFeGFtcGxlU3RvcmUoKTtcbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gc2lub24uc3B5KCk7XG4gICAgICBzdG9yZS5hZGRMaXN0ZW5lcignY2hhbmdlJywgbGlzdGVuZXIpO1xuXG4gICAgICBzdG9yZS5mb3JjZVVwZGF0ZSgpO1xuXG4gICAgICBleHBlY3QobGlzdGVuZXIuY2FsbGVkT25jZSkudG8uYmUudHJ1ZTtcbiAgICB9KTtcblxuICAgIGl0KCdkb2VzblxcJ3QgbW9kaWZ5IGV4aXN0aW5nIHN0YXRlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgRXhhbXBsZVN0b3JlKCk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IHNpbm9uLnNweSgpO1xuICAgICAgc3RvcmUuYWRkTGlzdGVuZXIoJ2NoYW5nZScsIGxpc3RlbmVyKTtcblxuICAgICAgc3RvcmUucmVnaXN0ZXIoYWN0aW9uSWQsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlcGxhY2VTdGF0ZSh7IGJhcjogJ2JheicgfSk7XG4gICAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcblxuICAgICAgICBleHBlY3QodGhpcy5zdGF0ZSkudG8uZGVlcC5lcXVhbCh7IGZvbzogJ2JhcicgfSk7XG4gICAgICAgIGV4cGVjdChsaXN0ZW5lci5jYWxsZWQpLnRvLmJlLmZhbHNlO1xuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBmb286ICdiYXInIH0pO1xuICAgICAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XG4gICAgICAgIHRoaXMucmVwbGFjZVN0YXRlKHsgYmF6OiAnZm9vJyB9KTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBTaW11bGF0ZSBkaXNwYXRjaFxuICAgICAgc3RvcmUuaGFuZGxlcih7IGFjdGlvbklkLCBib2R5OiAnZm9vYmFyJyB9KTtcblxuICAgICAgZXhwZWN0KGxpc3RlbmVyLmNhbGxlZE9uY2UpLnRvLmJlLnRydWU7XG4gICAgICBleHBlY3Qoc3RvcmUuc3RhdGUpLnRvLmRlZXAuZXF1YWwoeyBiYXo6ICdmb28nIH0pO1xuICAgIH0pO1xuICB9KTtcblxufSk7XG4iXX0=