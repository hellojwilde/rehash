"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _Flux = require("../Flux");

var Flux = _Flux.Flux;
var Actions = _Flux.Actions;

var sinon = _interopRequire(require("sinon"));

describe("Actions", function () {
  var TestActions = (function (_Actions) {
    function TestActions() {
      _classCallCheck(this, TestActions);

      if (_Actions != null) {
        _Actions.apply(this, arguments);
      }
    }

    _inherits(TestActions, _Actions);

    _createClass(TestActions, {
      getFoo: {
        value: function getFoo() {
          return { foo: "bar" };
        }
      },
      getBar: {
        value: function getBar() {
          return { bar: "baz" };
        }
      },
      getBaz: {
        value: function getBaz() {
          return;
        }
      },
      asyncAction: {
        value: function asyncAction(returnValue) {
          return regeneratorRuntime.async(function asyncAction$(context$3$0) {
            while (1) switch (context$3$0.prev = context$3$0.next) {
              case 0:
                return context$3$0.abrupt("return", returnValue);

              case 1:
              case "end":
                return context$3$0.stop();
            }
          }, null, this);
        }
      },
      badAsyncAction: {
        value: function badAsyncAction() {
          return Promise.reject(new Error("some error"));
        }
      }
    });

    return TestActions;
  })(Actions);

  describe("#getActionIds / #getConstants", function () {
    it("returns strings corresponding to action method names", function () {
      var actions = new TestActions();

      var actionIds = actions.getActionIds();

      expect(actionIds.getFoo).to.be.a("string");
      expect(actionIds.getBar).to.be.a("string");

      expect(actionIds.getFoo).to.be.a("string");
      expect(actionIds.getBar).to.be.a("string");
    });
  });

  describe("#[methodName]", function () {
    it("calls Flux dispatcher", function () {
      var actions = new TestActions();

      // Attach mock flux instance
      var dispatch = sinon.spy();
      actions.dispatch = dispatch;

      actions.getFoo();
      expect(dispatch.firstCall.args[1]).to.deep.equal({ foo: "bar" });
    });

    it("warns if actions have not been added to a Flux instance", function () {
      var actions = new TestActions();
      var warn = sinon.spy(console, "warn");

      actions.getFoo();

      expect(warn.firstCall.args[0]).to.equal("You've attempted to perform the action TestActions#getFoo, but it " + "hasn't been added to a Flux instance.");

      actions.asyncAction();

      expect(warn.secondCall.args[0]).to.equal("You've attempted to perform the asynchronous action " + "TestActions#asyncAction, but it hasn't been added " + "to a Flux instance.");

      console.warn.restore();
    });

    it("sends return value to Flux dispatch", function () {
      var actions = new TestActions();
      var actionId = actions.getActionIds().getFoo;
      var dispatch = sinon.spy();
      actions.dispatch = dispatch;

      actions.getFoo();

      expect(dispatch.firstCall.args[0]).to.equal(actionId);
      expect(dispatch.firstCall.args[1]).to.deep.equal({ foo: "bar" });
    });

    it("send async return value to Flux#dispatchAsync", function callee$2$0() {
      var actions, actionId, dispatch, response;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            actions = new TestActions();
            actionId = actions.getActionIds().asyncAction;
            dispatch = sinon.stub().returns(Promise.resolve());

            actions.dispatchAsync = dispatch;

            response = actions.asyncAction("foobar");

            expect(response.then).to.be.a("function");

            context$3$0.next = 8;
            return response;

          case 8:

            expect(dispatch.firstCall.args[0]).to.equal(actionId);
            expect(dispatch.firstCall.args[1]).to.be.an.instanceOf(Promise);

          case 10:
          case "end":
            return context$3$0.stop();
        }
      }, null, this);
    });

    it("skips disptach if return value is undefined", function () {
      var actions = new TestActions();
      var dispatch = sinon.spy();
      actions.dispatch = dispatch;

      actions.getBaz();

      expect(dispatch.called).to.be["false"];
    });

    it("does not skip async dispatch, even if resolved value is undefined", function () {
      var actions = new TestActions();
      var dispatch = sinon.stub().returns(Promise.resolve(undefined));
      actions.dispatchAsync = dispatch;

      actions.asyncAction();

      expect(dispatch.called).to.be["true"];
    });

    it("returns value from wrapped action", function callee$2$1() {
      var flux, actions;
      return regeneratorRuntime.async(function callee$2$1$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            flux = new Flux();
            actions = flux.createActions("test", TestActions);

            expect(actions.getFoo()).to.deep.equal({ foo: "bar" });
            context$3$0.next = 5;
            return expect(actions.asyncAction("async result")).to.eventually.equal("async result");

          case 5:
          case "end":
            return context$3$0.stop();
        }
      }, null, this);
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9fX3Rlc3RzX18vQWN0aW9ucy10ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBQThCLFNBQVM7O0lBQTlCLElBQUksU0FBSixJQUFJO0lBQUUsT0FBTyxTQUFQLE9BQU87O0lBQ2YsS0FBSywyQkFBTSxPQUFPOztBQUV6QixRQUFRLENBQUMsU0FBUyxFQUFFLFlBQU07TUFFbEIsV0FBVzthQUFYLFdBQVc7NEJBQVgsV0FBVzs7Ozs7OztjQUFYLFdBQVc7O2lCQUFYLFdBQVc7QUFDZixZQUFNO2VBQUEsa0JBQUc7QUFDUCxpQkFBTyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQztTQUN2Qjs7QUFFRCxZQUFNO2VBQUEsa0JBQUc7QUFDUCxpQkFBTyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQztTQUN2Qjs7QUFFRCxZQUFNO2VBQUEsa0JBQUc7QUFDUCxpQkFBTztTQUNSOztBQUVLLGlCQUFXO2VBQUEscUJBQUMsV0FBVzs7OztvREFDcEIsV0FBVzs7Ozs7OztTQUNuQjs7QUFFRCxvQkFBYztlQUFBLDBCQUFHO0FBQ2YsaUJBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1NBQ2hEOzs7O1dBbkJHLFdBQVc7S0FBUyxPQUFPOztBQXNCakMsVUFBUSxDQUFDLCtCQUErQixFQUFFLFlBQU07QUFDOUMsTUFBRSxDQUFDLHNEQUFzRCxFQUFFLFlBQU07QUFDL0QsVUFBTSxPQUFPLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQzs7QUFFbEMsVUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDOztBQUV6QyxZQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzNDLFlBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFB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QUM7QUFDbEUsYUFBTyxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUM7O0FBRWpDLGFBQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7QUFFdEIsWUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFLLENBQUM7S0FDcEMsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyxtQ0FBbUMsRUFBRTtVQUNoQyxJQUFJLEVBQ0osT0FBTzs7OztBQURQLGdCQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7QUFDakIsbUJBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUM7O0FBRXZELGtCQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQzs7bUJBQ2pELE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQzlDLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQzs7Ozs7OztLQUN2QyxDQUFDLENBQUM7R0FFSixDQUFDLENBQUM7Q0FFSixDQUFDLENBQUMiLCJmaWxlIjoic3JjL19fdGVzdHNfXy9BY3Rpb25zLXRlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGbHV4LCBBY3Rpb25zIH0gZnJvbSAnLi4vRmx1eCc7XG5pbXBvcnQgc2lub24gZnJvbSAnc2lub24nO1xuXG5kZXNjcmliZSgnQWN0aW9ucycsICgpID0+IHtcblxuICBjbGFzcyBUZXN0QWN0aW9ucyBleHRlbmRzIEFjdGlvbnMge1xuICAgIGdldEZvbygpIHtcbiAgICAgIHJldHVybiB7IGZvbzogJ2JhcicgfTtcbiAgICB9XG5cbiAgICBnZXRCYXIoKSB7XG4gICAgICByZXR1cm4geyBiYXI6ICdiYXonIH07XG4gICAgfVxuXG4gICAgZ2V0QmF6KCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGFzeW5jIGFzeW5jQWN0aW9uKHJldHVyblZhbHVlKSB7XG4gICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gICAgfVxuXG4gICAgYmFkQXN5bmNBY3Rpb24oKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdzb21lIGVycm9yJykpO1xuICAgIH1cbiAgfVxuXG4gIGRlc2NyaWJlKCcjZ2V0QWN0aW9uSWRzIC8gI2dldENvbnN0YW50cycsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyBzdHJpbmdzIGNvcnJlc3BvbmRpbmcgdG8gYWN0aW9uIG1ldGhvZCBuYW1lcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbnMgPSBuZXcgVGVzdEFjdGlvbnMoKTtcblxuICAgICAgY29uc3QgYWN0aW9uSWRzID0gYWN0aW9ucy5nZXRBY3Rpb25JZHMoKTtcblxuICAgICAgZXhwZWN0KGFjdGlvbklkcy5nZXRGb28pLnRvLmJlLmEoJ3N0cmluZycpO1xuICAgICAgZXhwZWN0KGFjdGlvbklkcy5nZXRCYXIpLnRvLmJlLmEoJ3N0cmluZycpO1xuXG4gICAgICBleHBlY3QoYWN0aW9uSWRzLmdldEZvbykudG8uYmUuYSgnc3RyaW5nJyk7XG4gICAgICBleHBlY3QoYWN0aW9uSWRzLmdldEJhcikudG8uYmUuYSgnc3RyaW5nJyk7XG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNbbWV0aG9kTmFtZV0nLCAoKSA9PiB7XG4gICAgaXQoJ2NhbGxzIEZsdXggZGlzcGF0Y2hlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbnMgPSBuZXcgVGVzdEFjdGlvbnMoKTtcblxuICAgICAgLy8gQXR0YWNoIG1vY2sgZmx1eCBpbnN0YW5jZVxuICAgICAgY29uc3QgZGlzcGF0Y2ggPSBzaW5vbi5zcHkoKTtcbiAgICAgIGFjdGlvbnMuZGlzcGF0Y2ggPSBkaXNwYXRjaDtcblxuICAgICAgYWN0aW9ucy5nZXRGb28oKTtcbiAgICAgIGV4cGVjdChkaXNwYXRjaC5maXJzdENhbGwuYXJnc1sxXSkudG8uZGVlcC5lcXVhbCh7IGZvbzogJ2JhcicgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnd2FybnMgaWYgYWN0aW9ucyBoYXZlIG5vdCBiZWVuIGFkZGVkIHRvIGEgRmx1eCBpbnN0YW5jZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbnMgPSBuZXcgVGVzdEFjdGlvbnMoKTtcbiAgICAgIGNvbnN0IHdhcm4gPSBzaW5vbi5zcHkoY29uc29sZSwgJ3dhcm4nKTtcblxuICAgICAgYWN0aW9ucy5nZXRGb28oKTtcblxuICAgICAgZXhwZWN0KHdhcm4uZmlyc3RDYWxsLmFyZ3NbMF0pLnRvLmVxdWFsKFxuICAgICAgICAnWW91XFwndmUgYXR0ZW1wdGVkIHRvIHBlcmZvcm0gdGhlIGFjdGlvbiBUZXN0QWN0aW9ucyNnZXRGb28sIGJ1dCBpdCAnXG4gICAgICArICdoYXNuXFwndCBiZWVuIGFkZGVkIHRvIGEgRmx1eCBpbnN0YW5jZS4nXG4gICAgICApO1xuXG4gICAgICBhY3Rpb25zLmFzeW5jQWN0aW9uKCk7XG5cbiAgICAgIGV4cGVjdCh3YXJuLnNlY29uZENhbGwuYXJnc1swXSkudG8uZXF1YWwoXG4gICAgICAgIGBZb3UndmUgYXR0ZW1wdGVkIHRvIHBlcmZvcm0gdGhlIGFzeW5jaHJvbm91cyBhY3Rpb24gYFxuICAgICAgKyBgVGVzdEFjdGlvbnMjYXN5bmNBY3Rpb24sIGJ1dCBpdCBoYXNuJ3QgYmVlbiBhZGRlZCBgXG4gICAgICArIGB0byBhIEZsdXggaW5zdGFuY2UuYFxuICAgICAgKTtcblxuICAgICAgY29uc29sZS53YXJuLnJlc3RvcmUoKTtcbiAgICB9KTtcblxuICAgIGl0KCdzZW5kcyByZXR1cm4gdmFsdWUgdG8gRmx1eCBkaXNwYXRjaCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbnMgPSBuZXcgVGVzdEFjdGlvbnMoKTtcbiAgICAgIGNvbnN0IGFjdGlvbklkID0gYWN0aW9ucy5nZXRBY3Rpb25JZHMoKS5nZXRGb287XG4gICAgICBjb25zdCBkaXNwYXRjaCA9IHNpbm9uLnNweSgpO1xuICAgICAgYWN0aW9ucy5kaXNwYXRjaCA9IGRpc3BhdGNoO1xuXG4gICAgICBhY3Rpb25zLmdldEZvbygpO1xuXG4gICAgICBleHBlY3QoZGlzcGF0Y2guZmlyc3RDYWxsLmFyZ3NbMF0pLnRvLmVxdWFsKGFjdGlvbklkKTtcbiAgICAgIGV4cGVjdChkaXNwYXRjaC5maXJzdENhbGwuYXJnc1sxXSkudG8uZGVlcC5lcXVhbCh7IGZvbzogJ2JhcicgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2VuZCBhc3luYyByZXR1cm4gdmFsdWUgdG8gRmx1eCNkaXNwYXRjaEFzeW5jJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBhY3Rpb25zID0gbmV3IFRlc3RBY3Rpb25zKCk7XG4gICAgICBjb25zdCBhY3Rpb25JZCA9IGFjdGlvbnMuZ2V0QWN0aW9uSWRzKCkuYXN5bmNBY3Rpb247XG4gICAgICBjb25zdCBkaXNwYXRjaCA9IHNpbm9uLnN0dWIoKS5yZXR1cm5zKFByb21pc2UucmVzb2x2ZSgpKTtcbiAgICAgIGFjdGlvbnMuZGlzcGF0Y2hBc3luYyA9IGRpc3BhdGNoO1xuXG4gICAgICBjb25zdCByZXNwb25zZSA9IGFjdGlvbnMuYXN5bmNBY3Rpb24oJ2Zvb2JhcicpO1xuXG4gICAgICBleHBlY3QocmVzcG9uc2UudGhlbikudG8uYmUuYSgnZnVuY3Rpb24nKTtcblxuICAgICAgYXdhaXQgcmVzcG9uc2U7XG5cbiAgICAgIGV4cGVjdChkaXNwYXRjaC5maXJzdENhbGwuYXJnc1swXSkudG8uZXF1YWwoYWN0aW9uSWQpO1xuICAgICAgZXhwZWN0KGRpc3BhdGNoLmZpcnN0Q2FsbC5hcmdzWzFdKS50by5iZS5hbi5pbnN0YW5jZU9mKFByb21pc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3NraXBzIGRpc3B0YWNoIGlmIHJldHVybiB2YWx1ZSBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb25zID0gbmV3IFRlc3RBY3Rpb25zKCk7XG4gICAgICBjb25zdCBkaXNwYXRjaCA9IHNpbm9uLnNweSgpO1xuICAgICAgYWN0aW9ucy5kaXNwYXRjaCA9IGRpc3BhdGNoO1xuXG4gICAgICBhY3Rpb25zLmdldEJheigpO1xuXG4gICAgICBleHBlY3QoZGlzcGF0Y2guY2FsbGVkKS50by5iZS5mYWxzZTtcbiAgICB9KTtcblxuICAgIGl0KCdkb2VzIG5vdCBza2lwIGFzeW5jIGRpc3BhdGNoLCBldmVuIGlmIHJlc29sdmVkIHZhbHVlIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbnMgPSBuZXcgVGVzdEFjdGlvbnMoKTtcbiAgICAgIGNvbnN0IGRpc3BhdGNoID0gc2lub24uc3R1YigpLnJldHVybnMoUHJvbWlzZS5yZXNvbHZlKHVuZGVmaW5lZCkpO1xuICAgICAgYWN0aW9ucy5kaXNwYXRjaEFzeW5jID0gZGlzcGF0Y2g7XG5cbiAgICAgIGFjdGlvbnMuYXN5bmNBY3Rpb24oKTtcblxuICAgICAgZXhwZWN0KGRpc3BhdGNoLmNhbGxlZCkudG8uYmUudHJ1ZTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIHZhbHVlIGZyb20gd3JhcHBlZCBhY3Rpb24nLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgICAgY29uc3QgYWN0aW9ucyA9IGZsdXguY3JlYXRlQWN0aW9ucygndGVzdCcsIFRlc3RBY3Rpb25zKTtcblxuICAgICAgZXhwZWN0KGFjdGlvbnMuZ2V0Rm9vKCkpLnRvLmRlZXAuZXF1YWwoeyBmb286ICdiYXInIH0pO1xuICAgICAgYXdhaXQgZXhwZWN0KGFjdGlvbnMuYXN5bmNBY3Rpb24oJ2FzeW5jIHJlc3VsdCcpKVxuICAgICAgICAudG8uZXZlbnR1YWxseS5lcXVhbCgnYXN5bmMgcmVzdWx0Jyk7XG4gICAgfSk7XG5cbiAgfSk7XG5cbn0pO1xuIl19