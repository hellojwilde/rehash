"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Actions
 *
 * Instances of the Actions class represent a set of actions. (In Flux parlance,
 * these might be more accurately denoted as Action Creators, while Action
 * refers to the payload sent to the dispatcher, but this is... confusing. We
 * will use Action to mean the function you call to trigger a dispatch.)
 *
 * Create actions by extending from the base Actions class and adding methods.
 * All methods on the prototype (except the constructor) will be
 * converted into actions. The return value of an action is used as the body
 * of the payload sent to the dispatcher.
 */

var uniqueId = _interopRequire(require("uniqueid"));

var Actions = (function () {
  function Actions() {
    _classCallCheck(this, Actions);

    this._baseId = uniqueId();

    var methodNames = this._getActionMethodNames();
    for (var i = 0; i < methodNames.length; i++) {
      var methodName = methodNames[i];
      this._wrapAction(methodName);
    }

    this.getConstants = this.getActionIds;
  }

  _createClass(Actions, {
    getActionIds: {
      value: function getActionIds() {
        var _this = this;

        return this._getActionMethodNames().reduce(function (result, actionName) {
          result[actionName] = _this[actionName]._id;
          return result;
        }, {});
      }
    },
    _getActionMethodNames: {
      value: function _getActionMethodNames(instance) {
        var _this = this;

        return Object.getOwnPropertyNames(this.constructor.prototype).filter(function (name) {
          return name !== "constructor" && typeof _this[name] === "function";
        });
      }
    },
    _wrapAction: {
      value: function _wrapAction(methodName) {
        var _this = this;

        var originalMethod = this[methodName];
        var actionId = this._createActionId(methodName);

        var action = function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var body = originalMethod.apply(_this, args);

          if (isPromise(body)) {
            var promise = body;
            _this._dispatchAsync(actionId, promise, args, methodName)
            // Catch errors and do nothing
            // They can be handled by store or caller
            ["catch"](function (error) {});
          } else {
            _this._dispatch(actionId, body, args, methodName);
          }

          // Return original method's return value to caller
          return body;
        };

        action._id = actionId;

        this[methodName] = action;
      }
    },
    _createActionId: {

      /**
       * Create unique string constant for an action method, using
       * @param {string} methodName - Name of the action method
       */

      value: function _createActionId(methodName) {
        return "" + this._baseId + "-" + methodName;
      }
    },
    _dispatch: {
      value: function _dispatch(actionId, body, args, methodName) {
        if (typeof this.dispatch === "function") {
          if (typeof body !== "undefined") {
            this.dispatch(actionId, body, args);
          }
        } else {
          if (process.env.NODE_ENV !== "production") {
            console.warn("You've attempted to perform the action " + ("" + this.constructor.name + "#" + methodName + ", but it hasn't been added ") + "to a Flux instance.");
          }
        }

        return body;
      }
    },
    _dispatchAsync: {
      value: function _dispatchAsync(actionId, promise, args, methodName) {
        if (typeof this.dispatchAsync === "function") {
          return this.dispatchAsync(actionId, promise, args);
        } else {
          if (process.env.NODE_ENV !== "production") {
            console.warn("You've attempted to perform the asynchronous action " + ("" + this.constructor.name + "#" + methodName + ", but it hasn't been added ") + "to a Flux instance.");
          }

          return promise;
        }
      }
    }
  });

  return Actions;
})();

module.exports = Actions;

function isPromise(value) {
  return value && typeof value.then === "function";
}
//# sourceMappingURL=data:application/json;base64,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QyxDQUFDO1dBQ3JDO1NBQ0YsTUFBTTtBQUNMLGNBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssWUFBWSxFQUFFO0FBQ3pDLG1CQUFPLENBQUMsSUFBSSxDQUNWLGtEQUNHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxTQUFJLFVBQVUsaUNBQTZCLHdCQUM5QyxDQUN0QixDQUFDO1dBQ0g7U0FDRjs7QUFFRCxlQUFPLElBQUksQ0FBQztPQUNiOztBQUVELGtCQUFjO2FBQUEsd0JBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO0FBQ2xELFlBQUksT0FBTyxJQUFJLENBQUMsYUFBYSxLQUFLLFVBQVUsRUFBRTtBQUM1QyxpQkFBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDcEQsTUFBTTtBQUNMLGNBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssWUFBWSxFQUFFO0FBQ3pDLG1CQUFPLENBQUMsSUFBSSxDQUNWLCtEQUNHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxTQUFJLFVBQVUsaUNBQTZCLHdCQUM5QyxDQUN0QixDQUFDO1dBQ0g7O0FBRUQsaUJBQU8sT0FBTyxDQUFDO1NBQ2hCO09BRUY7Ozs7U0FqR2tCLE9BQU87OztpQkFBUCxPQUFPOztBQXFHNUIsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFO0FBQ3hCLFNBQU8sS0FBSyxJQUFJLE9BQU8sS0FBSyxDQUFDLElBQUksS0FBSyxVQUFVLENBQUM7Q0FDbEQiLCJmaWxlIjoic3JjL0FjdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFjdGlvbnNcbiAqXG4gKiBJbnN0YW5jZXMgb2YgdGhlIEFjdGlvbnMgY2xhc3MgcmVwcmVzZW50IGEgc2V0IG9mIGFjdGlvbnMuIChJbiBGbHV4IHBhcmxhbmNlLFxuICogdGhlc2UgbWlnaHQgYmUgbW9yZSBhY2N1cmF0ZWx5IGRlbm90ZWQgYXMgQWN0aW9uIENyZWF0b3JzLCB3aGlsZSBBY3Rpb25cbiAqIHJlZmVycyB0byB0aGUgcGF5bG9hZCBzZW50IHRvIHRoZSBkaXNwYXRjaGVyLCBidXQgdGhpcyBpcy4uLiBjb25mdXNpbmcuIFdlXG4gKiB3aWxsIHVzZSBBY3Rpb24gdG8gbWVhbiB0aGUgZnVuY3Rpb24geW91IGNhbGwgdG8gdHJpZ2dlciBhIGRpc3BhdGNoLilcbiAqXG4gKiBDcmVhdGUgYWN0aW9ucyBieSBleHRlbmRpbmcgZnJvbSB0aGUgYmFzZSBBY3Rpb25zIGNsYXNzIGFuZCBhZGRpbmcgbWV0aG9kcy5cbiAqIEFsbCBtZXRob2RzIG9uIHRoZSBwcm90b3R5cGUgKGV4Y2VwdCB0aGUgY29uc3RydWN0b3IpIHdpbGwgYmVcbiAqIGNvbnZlcnRlZCBpbnRvIGFjdGlvbnMuIFRoZSByZXR1cm4gdmFsdWUgb2YgYW4gYWN0aW9uIGlzIHVzZWQgYXMgdGhlIGJvZHlcbiAqIG9mIHRoZSBwYXlsb2FkIHNlbnQgdG8gdGhlIGRpc3BhdGNoZXIuXG4gKi9cblxuaW1wb3J0IHVuaXF1ZUlkIGZyb20gJ3VuaXF1ZWlkJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWN0aW9ucyB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB0aGlzLl9iYXNlSWQgPSB1bmlxdWVJZCgpO1xuXG4gICAgY29uc3QgbWV0aG9kTmFtZXMgPSB0aGlzLl9nZXRBY3Rpb25NZXRob2ROYW1lcygpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWV0aG9kTmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG1ldGhvZE5hbWUgPSBtZXRob2ROYW1lc1tpXTtcbiAgICAgIHRoaXMuX3dyYXBBY3Rpb24obWV0aG9kTmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5nZXRDb25zdGFudHMgPSB0aGlzLmdldEFjdGlvbklkcztcbiAgfVxuXG4gIGdldEFjdGlvbklkcygpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0QWN0aW9uTWV0aG9kTmFtZXMoKS5yZWR1Y2UoKHJlc3VsdCwgYWN0aW9uTmFtZSkgPT4ge1xuICAgICAgcmVzdWx0W2FjdGlvbk5hbWVdID0gdGhpc1thY3Rpb25OYW1lXS5faWQ7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sIHt9KTtcbiAgfVxuXG4gIF9nZXRBY3Rpb25NZXRob2ROYW1lcyhpbnN0YW5jZSkge1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzLmNvbnN0cnVjdG9yLnByb3RvdHlwZSlcbiAgICAgIC5maWx0ZXIobmFtZSA9PlxuICAgICAgICBuYW1lICE9PSAnY29uc3RydWN0b3InICYmXG4gICAgICAgIHR5cGVvZiB0aGlzW25hbWVdID09PSAnZnVuY3Rpb24nXG4gICAgICApO1xuICB9XG5cbiAgX3dyYXBBY3Rpb24obWV0aG9kTmFtZSkge1xuICAgIGNvbnN0IG9yaWdpbmFsTWV0aG9kID0gdGhpc1ttZXRob2ROYW1lXTtcbiAgICBjb25zdCBhY3Rpb25JZCA9IHRoaXMuX2NyZWF0ZUFjdGlvbklkKG1ldGhvZE5hbWUpO1xuXG4gICAgY29uc3QgYWN0aW9uID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgIGNvbnN0IGJvZHkgPSBvcmlnaW5hbE1ldGhvZC5hcHBseSh0aGlzLCBhcmdzKTtcblxuICAgICAgaWYgKGlzUHJvbWlzZShib2R5KSkge1xuICAgICAgICBjb25zdCBwcm9taXNlID0gYm9keTtcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2hBc3luYyhhY3Rpb25JZCwgcHJvbWlzZSwgYXJncywgbWV0aG9kTmFtZSlcbiAgICAgICAgICAvLyBDYXRjaCBlcnJvcnMgYW5kIGRvIG5vdGhpbmdcbiAgICAgICAgICAvLyBUaGV5IGNhbiBiZSBoYW5kbGVkIGJ5IHN0b3JlIG9yIGNhbGxlclxuICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7fSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9kaXNwYXRjaChhY3Rpb25JZCwgYm9keSwgYXJncywgbWV0aG9kTmFtZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFJldHVybiBvcmlnaW5hbCBtZXRob2QncyByZXR1cm4gdmFsdWUgdG8gY2FsbGVyXG4gICAgICByZXR1cm4gYm9keTtcbiAgICB9O1xuXG4gICAgYWN0aW9uLl9pZCA9IGFjdGlvbklkO1xuXG4gICAgdGhpc1ttZXRob2ROYW1lXSA9IGFjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdW5pcXVlIHN0cmluZyBjb25zdGFudCBmb3IgYW4gYWN0aW9uIG1ldGhvZCwgdXNpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZE5hbWUgLSBOYW1lIG9mIHRoZSBhY3Rpb24gbWV0aG9kXG4gICAqL1xuICBfY3JlYXRlQWN0aW9uSWQobWV0aG9kTmFtZSkge1xuICAgIHJldHVybiBgJHt0aGlzLl9iYXNlSWR9LSR7bWV0aG9kTmFtZX1gO1xuICB9XG5cbiAgX2Rpc3BhdGNoKGFjdGlvbklkLCBib2R5LCBhcmdzLCBtZXRob2ROYW1lKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmRpc3BhdGNoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAodHlwZW9mIGJvZHkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2goYWN0aW9uSWQsIGJvZHksIGFyZ3MpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgYFlvdSd2ZSBhdHRlbXB0ZWQgdG8gcGVyZm9ybSB0aGUgYWN0aW9uIGBcbiAgICAgICAgKyBgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9IyR7bWV0aG9kTmFtZX0sIGJ1dCBpdCBoYXNuJ3QgYmVlbiBhZGRlZCBgXG4gICAgICAgICsgYHRvIGEgRmx1eCBpbnN0YW5jZS5gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJvZHk7XG4gIH1cblxuICBfZGlzcGF0Y2hBc3luYyhhY3Rpb25JZCwgcHJvbWlzZSwgYXJncywgbWV0aG9kTmFtZSkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5kaXNwYXRjaEFzeW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNwYXRjaEFzeW5jKGFjdGlvbklkLCBwcm9taXNlLCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgIGBZb3UndmUgYXR0ZW1wdGVkIHRvIHBlcmZvcm0gdGhlIGFzeW5jaHJvbm91cyBhY3Rpb24gYFxuICAgICAgICArIGAke3RoaXMuY29uc3RydWN0b3IubmFtZX0jJHttZXRob2ROYW1lfSwgYnV0IGl0IGhhc24ndCBiZWVuIGFkZGVkIGBcbiAgICAgICAgKyBgdG8gYSBGbHV4IGluc3RhbmNlLmBcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG4gIH1cblxufVxuXG5mdW5jdGlvbiBpc1Byb21pc2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nO1xufVxuIl19