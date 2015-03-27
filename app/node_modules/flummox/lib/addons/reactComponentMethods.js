"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * React Component methods. These are the primitives used to implement
 * fluxMixin and FluxComponent.
 *
 * Exposes a Flux instance as `this.flux`. This requires that flux be passed as
 * either context or as a prop (prop takes precedence). Children also are given
 * access to flux instance as `context.flux`.
 *
 * It also adds the method `connectToStores()`, which ensures that the component
 * state stays in sync with the specified Flux stores. See the inline docs
 * of `connectToStores` for details.
 */

var _react = require("react");

var React = _interopRequire(_react);

var PropTypes = _react.PropTypes;

var Flux = require("../Flux").Flux;

var assign = _interopRequire(require("object-assign"));

var instanceMethods = {

  getChildContext: function getChildContext() {
    var flux = this.getFlux();

    if (!flux) {
      return {};
    }return { flux: flux };
  },

  getFlux: function getFlux() {
    return this.props.flux || this.context.flux;
  },

  initialize: function initialize() {
    this._fluxStateGetters = [];
    this._fluxListeners = {};
    this.flux = this.getFlux();

    if (!(this.flux instanceof Flux)) {
      // TODO: print the actual class name here
      throw new Error("fluxMixin: Could not find Flux instance. Ensure that your component " + "has either `this.context.flux` or `this.props.flux`.");
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    var flux = this.getFlux();

    for (var key in this._fluxListeners) {
      if (!this._fluxListeners.hasOwnProperty(key)) continue;

      var store = flux.getStore(key);
      if (typeof store === "undefined") continue;

      var listener = this._fluxListeners[key];

      store.removeListener("change", listener);
    }
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.updateStores(nextProps);
  },

  updateStores: function updateStores() {
    var props = arguments[0] === undefined ? this.props : arguments[0];

    var state = this.getStoreState(props);
    this.setState(state);
  },

  getStoreState: function getStoreState() {
    var props = arguments[0] === undefined ? this.props : arguments[0];

    return this._fluxStateGetters.reduce(function (result, stateGetter) {
      var getter = stateGetter.getter;
      var stores = stateGetter.stores;

      var stateFromStores = getter(stores, props);
      return assign(result, stateFromStores);
    }, {});
  },

  /**
   * Connect component to stores, get the combined initial state, and
   * subscribe to future changes. There are three ways to call it. The
   * simplest is to pass a single store key and, optionally, a state getter.
   * The state getter is a function that takes the store as a parameter and
   * returns the state that should be passed to the component's `setState()`.
   * If no state getter is specified, the default getter is used, which simply
   * returns the entire store state.
   *
   * The second form accepts an array of store keys. With this form, the state
   * getter is called once with an array of store instances (in the same order
   * as the store keys). the default getter performance a reduce on the entire
   * state for each store.
   *
   * The last form accepts an object of store keys mapped to state getters. As
   * a shortcut, you can pass `null` as a state getter to use the default
   * state getter.
   *
   * Returns the combined initial state of all specified stores.
   *
   * This way you can write all the initialization and update logic in a single
   * location, without having to mess with adding/removing listeners.
   *
   * @type {string|array|object} stateGetterMap - map of keys to getters
   * @returns {object} Combined initial state of stores
   */
  connectToStores: function connectToStores() {
    var _this = this;

    var stateGetterMap = arguments[0] === undefined ? {} : arguments[0];
    var stateGetter = arguments[1] === undefined ? null : arguments[1];

    var flux = this.getFlux();

    var getStore = function (key) {
      var store = flux.getStore(key);

      if (typeof store === "undefined") {
        throw new Error("connectToStores(): Store with key '" + key + "' does not exist.");
      }

      return store;
    };

    if (typeof stateGetterMap === "string") {
      var key = stateGetterMap;
      var store = getStore(key);
      var getter = stateGetter || defaultStateGetter;

      this._fluxStateGetters.push({ stores: store, getter: getter });
      var listener = createStoreListener(this, store, getter);

      store.addListener("change", listener);
      this._fluxListeners[key] = listener;
    } else if (Array.isArray(stateGetterMap)) {
      (function () {
        var stores = stateGetterMap.map(getStore);
        var getter = stateGetter || defaultReduceStateGetter;

        _this._fluxStateGetters.push({ stores: stores, getter: getter });
        var listener = createStoreListener(_this, stores, getter);

        stateGetterMap.forEach(function (key, index) {
          var store = stores[index];
          store.addListener("change", listener);
          _this._fluxListeners[key] = listener;
        });
      })();
    } else {
      for (var key in stateGetterMap) {
        var store = getStore(key);
        var getter = stateGetterMap[key] || defaultStateGetter;

        this._fluxStateGetters.push({ stores: store, getter: getter });
        var listener = createStoreListener(this, store, getter);

        store.addListener("change", listener);
        this._fluxListeners[key] = listener;
      }
    }

    return this.getStoreState();
  }

};

var staticProperties = {
  contextTypes: {
    flux: PropTypes.instanceOf(Flux) },

  childContextTypes: {
    flux: PropTypes.instanceOf(Flux) },

  propTypes: {
    connectToStores: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string), PropTypes.object]),
    flux: PropTypes.instanceOf(Flux),
    render: React.PropTypes.func,
    stateGetter: React.PropTypes.func } };

exports.instanceMethods = instanceMethods;
exports.staticProperties = staticProperties;

function createStoreListener(component, store, storeStateGetter) {
  return (function () {
    var state = storeStateGetter(store, this.props);
    this.setState(state);
  }).bind(component);
}

function defaultStateGetter(store) {
  return store.getStateAsObject();
}

function defaultReduceStateGetter(stores) {
  return stores.reduce(function (result, store) {
    return assign(result, store.getStateAsObject());
  }, {});
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hZGRvbnMvcmVhY3RDb21wb25lbnRNZXRob2RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQWE0QyxPQUFPOztJQUEvQixLQUFLOztJQUFFLFNBQVMsVUFBVCxTQUFTOztJQUMzQixJQUFJLFdBQVEsU0FBUyxFQUFyQixJQUFJOztJQUNOLE1BQU0sMkJBQU0sZUFBZTs7QUFFbEMsSUFBTSxlQUFlLEdBQUc7O0FBRXRCLGlCQUFlLEVBQUEsMkJBQUc7QUFDaEIsUUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUU1QixRQUFJLENBQUMsSUFBSTtBQUFFLGFBQU8sRUFBRSxDQUFDO0tBQUEsQUFFckIsT0FBTyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsQ0FBQztHQUNqQjs7QUFFRCxTQUFPLEVBQUEsbUJBQUc7QUFDUixXQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0dBQzdDOztBQUVELFlBQVUsRUFBQSxzQkFBRztBQUNYLFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFDNUIsUUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7QUFDekIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRTNCLFFBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxZQUFZLElBQUksQ0FBQSxBQUFDLEVBQUU7O0FBRWhDLFlBQU0sSUFBSSxLQUFLLENBQ2IsK0hBQzBELENBQzNELENBQUM7S0FDSDtHQUNGOztBQUVELHNCQUFvQixFQUFBLGdDQUFHO0FBQ3JCLFFBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFNUIsU0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO0FBQ25DLFVBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRSxTQUFTOztBQUV2RCxVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLFVBQUksT0FBTyxLQUFLLEtBQUssV0FBVyxFQUFFLFNBQVM7O0FBRTNDLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRTFDLFdBQUssQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQzFDO0dBQ0Y7O0FBRUQsMkJBQXlCLEVBQUEsbUNBQUMsU0FBUyxFQUFFO0FBQ25DLFFBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDOUI7O0FBRUQsY0FBWSxFQUFBLHdCQUFxQjtRQUFwQixLQUFLLGdDQUFHLElBQUksQ0FBQyxLQUFLOztBQUM3QixRQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hDLFFBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDdEI7O0FBRUQsZUFBYSxFQUFBLHlCQUFxQjtRQUFwQixLQUFLLGdDQUFHLElBQUksQ0FBQyxLQUFLOztBQUM5QixXQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQ2xDLFVBQUMsTUFBTSxFQUFFLFdBQVcsRUFBSztVQUNmLE1BQU0sR0FBYSxXQUFXLENBQTlCLE1BQU07VUFBRSxNQUFNLEdBQUssV0FBVyxDQUF0QixNQUFNOztBQUN0QixVQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzlDLGFBQU8sTUFBTSxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQztLQUN4QyxFQUFFLEVBQUUsQ0FDTixDQUFDO0dBQ0g7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QkQsaUJBQWUsRUFBQSwyQkFBMEM7OztRQUF6QyxjQUFjLGdDQUFHLEVBQUU7UUFBRSxXQUFXLGdDQUFHLElBQUk7O0FBQ3JELFFBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFNUIsUUFBTSxRQUFRLEdBQUcsVUFBQyxHQUFHLEVBQUs7QUFDeEIsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFakMsVUFBSSxPQUFPLEtBQUssS0FBSyxXQUFXLEVBQUU7QUFDaEMsY0FBTSxJQUFJLEtBQUsseUNBQ3lCLEdBQUcsdUJBQzFDLENBQUM7T0FDSDs7QUFFRCxhQUFPLEtBQUssQ0FBQztLQUNkLENBQUM7O0FBRUYsUUFBSSxPQUFPLGNBQWMsS0FBSyxRQUFRLEVBQUU7QUFDdEMsVUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDO0FBQzNCLFVBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QixVQUFNLE1BQU0sR0FBRyxXQUFXLElBQUksa0JBQWtCLENBQUM7O0FBRWpELFVBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZELFVBQU0sUUFBUSxHQUFHLG1CQUFtQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRTFELFdBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3RDLFVBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDO0tBQ3JDLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFOztBQUN4QyxZQUFNLE1BQU0sR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzVDLFlBQU0sTUFBTSxHQUFHLFdBQVcsSUFBSSx3QkFBd0IsQ0FBQzs7QUFFdkQsY0FBSyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ2hELFlBQU0sUUFBUSxHQUFHLG1CQUFtQixRQUFPLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFM0Qsc0JBQWMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFLO0FBQ3JDLGNBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QixlQUFLLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN0QyxnQkFBSyxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDO1NBQ3JDLENBQUMsQ0FBQzs7S0FFSixNQUFNO0FBQ0osV0FBSyxJQUFJLEdBQUcsSUFBSSxjQUFjLEVBQUU7QUFDL0IsWUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLFlBQU0sTUFBTSxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxrQkFBa0IsQ0FBQzs7QUFFekQsWUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDdkQsWUFBTSxRQUFRLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFMUQsYUFBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDdEMsWUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUM7T0FDckM7S0FDRjs7QUFFRCxXQUFPLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztHQUM3Qjs7Q0FFRixDQUFDOztBQUVGLElBQU0sZ0JBQWdCLEdBQUc7QUFDdkIsY0FBWSxFQUFFO0FBQ1osUUFBSSxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQ2pDOztBQUVELG1CQUFpQixFQUFFO0FBQ2pCLFFBQUksRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUNqQzs7QUFFRCxXQUFTLEVBQUU7QUFDVCxtQkFBZSxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FDbkMsU0FBUyxDQUFDLE1BQU0sRUFDaEIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQ25DLFNBQVMsQ0FBQyxNQUFNLENBQ2pCLENBQUM7QUFDRixRQUFJLEVBQUUsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7QUFDaEMsVUFBTSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSTtBQUM1QixlQUFXLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQ2xDLEVBQ0YsQ0FBQzs7UUFFTyxlQUFlLEdBQWYsZUFBZTtRQUFFLGdCQUFnQixHQUFoQixnQkFBZ0I7O0FBRTFDLFNBQVMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtBQUMvRCxTQUFPLENBQUEsWUFBVztBQUNoQixRQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2xELFFBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDdEIsQ0FBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztDQUNuQjs7QUFFRCxTQUFTLGtCQUFrQixDQUFDLEtBQUssRUFBRTtBQUNqQyxTQUFPLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0NBQ2pDOztBQUVELFNBQVMsd0JBQXdCLENBQUMsTUFBTSxFQUFFO0FBQ3hDLFNBQU8sTUFBTSxDQUFDLE1BQU0sQ0FDbEIsVUFBQyxNQUFNLEVBQUUsS0FBSztXQUFLLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLGdCQUFnQixFQUFFLENBQUM7R0FBQSxFQUMzRCxFQUFFLENBQ0gsQ0FBQztDQUNIIiwiZmlsZSI6InNyYy9hZGRvbnMvcmVhY3RDb21wb25lbnRNZXRob2RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBSZWFjdCBDb21wb25lbnQgbWV0aG9kcy4gVGhlc2UgYXJlIHRoZSBwcmltaXRpdmVzIHVzZWQgdG8gaW1wbGVtZW50XG4gKiBmbHV4TWl4aW4gYW5kIEZsdXhDb21wb25lbnQuXG4gKlxuICogRXhwb3NlcyBhIEZsdXggaW5zdGFuY2UgYXMgYHRoaXMuZmx1eGAuIFRoaXMgcmVxdWlyZXMgdGhhdCBmbHV4IGJlIHBhc3NlZCBhc1xuICogZWl0aGVyIGNvbnRleHQgb3IgYXMgYSBwcm9wIChwcm9wIHRha2VzIHByZWNlZGVuY2UpLiBDaGlsZHJlbiBhbHNvIGFyZSBnaXZlblxuICogYWNjZXNzIHRvIGZsdXggaW5zdGFuY2UgYXMgYGNvbnRleHQuZmx1eGAuXG4gKlxuICogSXQgYWxzbyBhZGRzIHRoZSBtZXRob2QgYGNvbm5lY3RUb1N0b3JlcygpYCwgd2hpY2ggZW5zdXJlcyB0aGF0IHRoZSBjb21wb25lbnRcbiAqIHN0YXRlIHN0YXlzIGluIHN5bmMgd2l0aCB0aGUgc3BlY2lmaWVkIEZsdXggc3RvcmVzLiBTZWUgdGhlIGlubGluZSBkb2NzXG4gKiBvZiBgY29ubmVjdFRvU3RvcmVzYCBmb3IgZGV0YWlscy5cbiAqL1xuXG5pbXBvcnQgeyBkZWZhdWx0IGFzIFJlYWN0LCBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBGbHV4IH0gZnJvbSAnLi4vRmx1eCc7XG5pbXBvcnQgYXNzaWduIGZyb20gJ29iamVjdC1hc3NpZ24nO1xuXG5jb25zdCBpbnN0YW5jZU1ldGhvZHMgPSB7XG5cbiAgZ2V0Q2hpbGRDb250ZXh0KCkge1xuICAgIGNvbnN0IGZsdXggPSB0aGlzLmdldEZsdXgoKTtcblxuICAgIGlmICghZmx1eCkgcmV0dXJuIHt9O1xuXG4gICAgcmV0dXJuIHsgZmx1eCB9O1xuICB9LFxuXG4gIGdldEZsdXgoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuZmx1eCB8fCB0aGlzLmNvbnRleHQuZmx1eDtcbiAgfSxcblxuICBpbml0aWFsaXplKCkge1xuICAgIHRoaXMuX2ZsdXhTdGF0ZUdldHRlcnMgPSBbXTtcbiAgICB0aGlzLl9mbHV4TGlzdGVuZXJzID0ge307XG4gICAgdGhpcy5mbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG5cbiAgICBpZiAoISh0aGlzLmZsdXggaW5zdGFuY2VvZiBGbHV4KSkge1xuICAgICAgLy8gVE9ETzogcHJpbnQgdGhlIGFjdHVhbCBjbGFzcyBuYW1lIGhlcmVcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYGZsdXhNaXhpbjogQ291bGQgbm90IGZpbmQgRmx1eCBpbnN0YW5jZS4gRW5zdXJlIHRoYXQgeW91ciBjb21wb25lbnQgYFxuICAgICAgKyBgaGFzIGVpdGhlciBcXGB0aGlzLmNvbnRleHQuZmx1eFxcYCBvciBcXGB0aGlzLnByb3BzLmZsdXhcXGAuYFxuICAgICAgKTtcbiAgICB9XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgY29uc3QgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xuXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuX2ZsdXhMaXN0ZW5lcnMpIHtcbiAgICAgIGlmICghdGhpcy5fZmx1eExpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcblxuICAgICAgY29uc3Qgc3RvcmUgPSBmbHV4LmdldFN0b3JlKGtleSk7XG4gICAgICBpZiAodHlwZW9mIHN0b3JlID09PSAndW5kZWZpbmVkJykgY29udGludWU7XG5cbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy5fZmx1eExpc3RlbmVyc1trZXldO1xuXG4gICAgICBzdG9yZS5yZW1vdmVMaXN0ZW5lcignY2hhbmdlJywgbGlzdGVuZXIpO1xuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIHRoaXMudXBkYXRlU3RvcmVzKG5leHRQcm9wcyk7XG4gIH0sXG5cbiAgdXBkYXRlU3RvcmVzKHByb3BzID0gdGhpcy5wcm9wcykge1xuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5nZXRTdG9yZVN0YXRlKHByb3BzKTtcbiAgICB0aGlzLnNldFN0YXRlKHN0YXRlKTtcbiAgfSxcblxuICBnZXRTdG9yZVN0YXRlKHByb3BzID0gdGhpcy5wcm9wcykge1xuICAgIHJldHVybiB0aGlzLl9mbHV4U3RhdGVHZXR0ZXJzLnJlZHVjZShcbiAgICAgIChyZXN1bHQsIHN0YXRlR2V0dGVyKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgZ2V0dGVyLCBzdG9yZXMgfSA9IHN0YXRlR2V0dGVyO1xuICAgICAgICBjb25zdCBzdGF0ZUZyb21TdG9yZXMgPSBnZXR0ZXIoc3RvcmVzLCBwcm9wcyk7XG4gICAgICAgIHJldHVybiBhc3NpZ24ocmVzdWx0LCBzdGF0ZUZyb21TdG9yZXMpO1xuICAgICAgfSwge31cbiAgICApO1xuICB9LFxuXG4gICAvKipcbiAgICAqIENvbm5lY3QgY29tcG9uZW50IHRvIHN0b3JlcywgZ2V0IHRoZSBjb21iaW5lZCBpbml0aWFsIHN0YXRlLCBhbmRcbiAgICAqIHN1YnNjcmliZSB0byBmdXR1cmUgY2hhbmdlcy4gVGhlcmUgYXJlIHRocmVlIHdheXMgdG8gY2FsbCBpdC4gVGhlXG4gICAgKiBzaW1wbGVzdCBpcyB0byBwYXNzIGEgc2luZ2xlIHN0b3JlIGtleSBhbmQsIG9wdGlvbmFsbHksIGEgc3RhdGUgZ2V0dGVyLlxuICAgICogVGhlIHN0YXRlIGdldHRlciBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgdGhlIHN0b3JlIGFzIGEgcGFyYW1ldGVyIGFuZFxuICAgICogcmV0dXJucyB0aGUgc3RhdGUgdGhhdCBzaG91bGQgYmUgcGFzc2VkIHRvIHRoZSBjb21wb25lbnQncyBgc2V0U3RhdGUoKWAuXG4gICAgKiBJZiBubyBzdGF0ZSBnZXR0ZXIgaXMgc3BlY2lmaWVkLCB0aGUgZGVmYXVsdCBnZXR0ZXIgaXMgdXNlZCwgd2hpY2ggc2ltcGx5XG4gICAgKiByZXR1cm5zIHRoZSBlbnRpcmUgc3RvcmUgc3RhdGUuXG4gICAgKlxuICAgICogVGhlIHNlY29uZCBmb3JtIGFjY2VwdHMgYW4gYXJyYXkgb2Ygc3RvcmUga2V5cy4gV2l0aCB0aGlzIGZvcm0sIHRoZSBzdGF0ZVxuICAgICogZ2V0dGVyIGlzIGNhbGxlZCBvbmNlIHdpdGggYW4gYXJyYXkgb2Ygc3RvcmUgaW5zdGFuY2VzIChpbiB0aGUgc2FtZSBvcmRlclxuICAgICogYXMgdGhlIHN0b3JlIGtleXMpLiB0aGUgZGVmYXVsdCBnZXR0ZXIgcGVyZm9ybWFuY2UgYSByZWR1Y2Ugb24gdGhlIGVudGlyZVxuICAgICogc3RhdGUgZm9yIGVhY2ggc3RvcmUuXG4gICAgKlxuICAgICogVGhlIGxhc3QgZm9ybSBhY2NlcHRzIGFuIG9iamVjdCBvZiBzdG9yZSBrZXlzIG1hcHBlZCB0byBzdGF0ZSBnZXR0ZXJzLiBBc1xuICAgICogYSBzaG9ydGN1dCwgeW91IGNhbiBwYXNzIGBudWxsYCBhcyBhIHN0YXRlIGdldHRlciB0byB1c2UgdGhlIGRlZmF1bHRcbiAgICAqIHN0YXRlIGdldHRlci5cbiAgICAqXG4gICAgKiBSZXR1cm5zIHRoZSBjb21iaW5lZCBpbml0aWFsIHN0YXRlIG9mIGFsbCBzcGVjaWZpZWQgc3RvcmVzLlxuICAgICpcbiAgICAqIFRoaXMgd2F5IHlvdSBjYW4gd3JpdGUgYWxsIHRoZSBpbml0aWFsaXphdGlvbiBhbmQgdXBkYXRlIGxvZ2ljIGluIGEgc2luZ2xlXG4gICAgKiBsb2NhdGlvbiwgd2l0aG91dCBoYXZpbmcgdG8gbWVzcyB3aXRoIGFkZGluZy9yZW1vdmluZyBsaXN0ZW5lcnMuXG4gICAgKlxuICAgICogQHR5cGUge3N0cmluZ3xhcnJheXxvYmplY3R9IHN0YXRlR2V0dGVyTWFwIC0gbWFwIG9mIGtleXMgdG8gZ2V0dGVyc1xuICAgICogQHJldHVybnMge29iamVjdH0gQ29tYmluZWQgaW5pdGlhbCBzdGF0ZSBvZiBzdG9yZXNcbiAgICAqL1xuICBjb25uZWN0VG9TdG9yZXMoc3RhdGVHZXR0ZXJNYXAgPSB7fSwgc3RhdGVHZXR0ZXIgPSBudWxsKSB7XG4gICAgY29uc3QgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xuXG4gICAgY29uc3QgZ2V0U3RvcmUgPSAoa2V5KSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IGZsdXguZ2V0U3RvcmUoa2V5KTtcblxuICAgICAgaWYgKHR5cGVvZiBzdG9yZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBjb25uZWN0VG9TdG9yZXMoKTogU3RvcmUgd2l0aCBrZXkgJyR7a2V5fScgZG9lcyBub3QgZXhpc3QuYFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RvcmU7XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2Ygc3RhdGVHZXR0ZXJNYXAgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCBrZXkgPSBzdGF0ZUdldHRlck1hcDtcbiAgICAgIGNvbnN0IHN0b3JlID0gZ2V0U3RvcmUoa2V5KTtcbiAgICAgIGNvbnN0IGdldHRlciA9IHN0YXRlR2V0dGVyIHx8IGRlZmF1bHRTdGF0ZUdldHRlcjtcblxuICAgICAgdGhpcy5fZmx1eFN0YXRlR2V0dGVycy5wdXNoKHsgc3RvcmVzOiBzdG9yZSwgZ2V0dGVyIH0pO1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSBjcmVhdGVTdG9yZUxpc3RlbmVyKHRoaXMsIHN0b3JlLCBnZXR0ZXIpO1xuXG4gICAgICBzdG9yZS5hZGRMaXN0ZW5lcignY2hhbmdlJywgbGlzdGVuZXIpO1xuICAgICAgdGhpcy5fZmx1eExpc3RlbmVyc1trZXldID0gbGlzdGVuZXI7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHN0YXRlR2V0dGVyTWFwKSkge1xuICAgICAgY29uc3Qgc3RvcmVzID0gc3RhdGVHZXR0ZXJNYXAubWFwKGdldFN0b3JlKTtcbiAgICAgIGNvbnN0IGdldHRlciA9IHN0YXRlR2V0dGVyIHx8IGRlZmF1bHRSZWR1Y2VTdGF0ZUdldHRlcjtcblxuICAgICAgdGhpcy5fZmx1eFN0YXRlR2V0dGVycy5wdXNoKHsgc3RvcmVzLCBnZXR0ZXIgfSk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IGNyZWF0ZVN0b3JlTGlzdGVuZXIodGhpcywgc3RvcmVzLCBnZXR0ZXIpO1xuXG4gICAgICBzdGF0ZUdldHRlck1hcC5mb3JFYWNoKChrZXksIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHN0b3JlID0gc3RvcmVzW2luZGV4XTtcbiAgICAgICAgc3RvcmUuYWRkTGlzdGVuZXIoJ2NoYW5nZScsIGxpc3RlbmVyKTtcbiAgICAgICAgdGhpcy5fZmx1eExpc3RlbmVyc1trZXldID0gbGlzdGVuZXI7XG4gICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgZm9yIChsZXQga2V5IGluIHN0YXRlR2V0dGVyTWFwKSB7XG4gICAgICAgIGNvbnN0IHN0b3JlID0gZ2V0U3RvcmUoa2V5KTtcbiAgICAgICAgY29uc3QgZ2V0dGVyID0gc3RhdGVHZXR0ZXJNYXBba2V5XSB8fCBkZWZhdWx0U3RhdGVHZXR0ZXI7XG5cbiAgICAgICAgdGhpcy5fZmx1eFN0YXRlR2V0dGVycy5wdXNoKHsgc3RvcmVzOiBzdG9yZSwgZ2V0dGVyIH0pO1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IGNyZWF0ZVN0b3JlTGlzdGVuZXIodGhpcywgc3RvcmUsIGdldHRlcik7XG5cbiAgICAgICAgc3RvcmUuYWRkTGlzdGVuZXIoJ2NoYW5nZScsIGxpc3RlbmVyKTtcbiAgICAgICAgdGhpcy5fZmx1eExpc3RlbmVyc1trZXldID0gbGlzdGVuZXI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZ2V0U3RvcmVTdGF0ZSgpO1xuICB9XG5cbn07XG5cbmNvbnN0IHN0YXRpY1Byb3BlcnRpZXMgPSB7XG4gIGNvbnRleHRUeXBlczoge1xuICAgIGZsdXg6IFByb3BUeXBlcy5pbnN0YW5jZU9mKEZsdXgpLFxuICB9LFxuXG4gIGNoaWxkQ29udGV4dFR5cGVzOiB7XG4gICAgZmx1eDogUHJvcFR5cGVzLmluc3RhbmNlT2YoRmx1eCksXG4gIH0sXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgY29ubmVjdFRvU3RvcmVzOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgICAgIFByb3BUeXBlcy5vYmplY3RcbiAgICBdKSxcbiAgICBmbHV4OiBQcm9wVHlwZXMuaW5zdGFuY2VPZihGbHV4KSxcbiAgICByZW5kZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIHN0YXRlR2V0dGVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgfSxcbn07XG5cbmV4cG9ydCB7IGluc3RhbmNlTWV0aG9kcywgc3RhdGljUHJvcGVydGllcyB9O1xuXG5mdW5jdGlvbiBjcmVhdGVTdG9yZUxpc3RlbmVyKGNvbXBvbmVudCwgc3RvcmUsIHN0b3JlU3RhdGVHZXR0ZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHN0YXRlID0gc3RvcmVTdGF0ZUdldHRlcihzdG9yZSwgdGhpcy5wcm9wcyk7XG4gICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSk7XG4gIH0uYmluZChjb21wb25lbnQpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0U3RhdGVHZXR0ZXIoc3RvcmUpIHtcbiAgcmV0dXJuIHN0b3JlLmdldFN0YXRlQXNPYmplY3QoKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFJlZHVjZVN0YXRlR2V0dGVyKHN0b3Jlcykge1xuICByZXR1cm4gc3RvcmVzLnJlZHVjZShcbiAgICAocmVzdWx0LCBzdG9yZSkgPT4gYXNzaWduKHJlc3VsdCwgc3RvcmUuZ2V0U3RhdGVBc09iamVjdCgpKSxcbiAgICB7fVxuICApO1xufVxuIl19