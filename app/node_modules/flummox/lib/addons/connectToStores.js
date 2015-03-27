"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Higher-order component form of connectToStores
 */

var React = _interopRequire(require("react"));

var _reactComponentMethods = require("./reactComponentMethods");

var instanceMethods = _reactComponentMethods.instanceMethods;
var staticProperties = _reactComponentMethods.staticProperties;

var assign = _interopRequire(require("object-assign"));

module.exports = function (BaseComponent, stores, stateGetter) {
  var ConnectedComponent = (function (_React$Component) {
    var _class = function ConnectedComponent(props, context) {
      _classCallCheck(this, _class);

      _get(Object.getPrototypeOf(_class.prototype), "constructor", this).call(this, props, context);

      this.initialize();

      this.state = this.connectToStores(stores, stateGetter);
    };

    _inherits(_class, _React$Component);

    _createClass(_class, {
      render: {
        value: function render() {
          return React.createElement(BaseComponent, this.state);
        }
      }
    });

    return _class;
  })(React.Component);

  assign(ConnectedComponent.prototype, instanceMethods);

  assign(ConnectedComponent, staticProperties);

  return ConnectedComponent;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hZGRvbnMvY29ubmVjdFRvU3RvcmVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFJTyxLQUFLLDJCQUFNLE9BQU87O3FDQUN5Qix5QkFBeUI7O0lBQWxFLGVBQWUsMEJBQWYsZUFBZTtJQUFFLGdCQUFnQiwwQkFBaEIsZ0JBQWdCOztJQUNuQyxNQUFNLDJCQUFNLGVBQWU7O2lCQUVuQixVQUFDLGFBQWEsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFLO0FBQ3JELE1BQU0sa0JBQWtCO2lCQUNYLDRCQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7OztBQUMxQixvRkFBTSxLQUFLLEVBQUUsT0FBTyxFQUFFOztBQUV0QixVQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7O0FBRWxCLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7S0FDeEQ7Ozs7O0FBRUQsWUFBTTtlQUFBLGtCQUFHO0FBQ1AsaUJBQU8sb0JBQUMsYUFBYSxFQUFLLElBQUksQ0FBQyxLQUFLLENBQUksQ0FBQztTQUMxQzs7Ozs7S0FYc0MsS0FBSyxDQUFDLFNBQVMsQ0FZdkQsQ0FBQzs7QUFFRixRQUFNLENBQ0osa0JBQWtCLENBQUMsU0FBUyxFQUM1QixlQUFlLENBQ2hCLENBQUM7O0FBRUYsUUFBTSxDQUFDLGtCQUFrQixFQUFFLGdCQUFnQixDQUFDLENBQUM7O0FBRTdDLFNBQU8sa0JBQWtCLENBQUM7Q0FDM0IiLCJmaWxlIjoic3JjL2FkZG9ucy9jb25uZWN0VG9TdG9yZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEhpZ2hlci1vcmRlciBjb21wb25lbnQgZm9ybSBvZiBjb25uZWN0VG9TdG9yZXNcbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgaW5zdGFuY2VNZXRob2RzLCBzdGF0aWNQcm9wZXJ0aWVzIH0gZnJvbSAnLi9yZWFjdENvbXBvbmVudE1ldGhvZHMnO1xuaW1wb3J0IGFzc2lnbiBmcm9tICdvYmplY3QtYXNzaWduJztcblxuZXhwb3J0IGRlZmF1bHQgKEJhc2VDb21wb25lbnQsIHN0b3Jlcywgc3RhdGVHZXR0ZXIpID0+IHtcbiAgY29uc3QgQ29ubmVjdGVkQ29tcG9uZW50ID0gY2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG5cbiAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuXG4gICAgICB0aGlzLnN0YXRlID0gdGhpcy5jb25uZWN0VG9TdG9yZXMoc3RvcmVzLCBzdGF0ZUdldHRlcik7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgcmV0dXJuIDxCYXNlQ29tcG9uZW50IHsuLi50aGlzLnN0YXRlfSAvPjtcbiAgICB9XG4gIH07XG5cbiAgYXNzaWduKFxuICAgIENvbm5lY3RlZENvbXBvbmVudC5wcm90b3R5cGUsXG4gICAgaW5zdGFuY2VNZXRob2RzXG4gICk7XG5cbiAgYXNzaWduKENvbm5lY3RlZENvbXBvbmVudCwgc3RhdGljUHJvcGVydGllcyk7XG5cbiAgcmV0dXJuIENvbm5lY3RlZENvbXBvbmVudDtcbn07XG4iXX0=