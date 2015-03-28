"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var connectToStores = _interopRequire(require("../connectToStores"));

var addContext = _interopRequire(require("./addContext"));

var _Flux = require("../../Flux");

var Actions = _Flux.Actions;
var Store = _Flux.Store;
var Flummox = _Flux.Flummox;

var React = _interopRequire(require("react/addons"));

var PropTypes = React.PropTypes;
var TestUtils = React.addons.TestUtils;

var TestActions = (function (_Actions) {
  function TestActions() {
    _classCallCheck(this, TestActions);

    if (_Actions != null) {
      _Actions.apply(this, arguments);
    }
  }

  _inherits(TestActions, _Actions);

  _createClass(TestActions, {
    getSomething: {
      value: function getSomething(something) {
        return something;
      }
    }
  });

  return TestActions;
})(Actions);

var TestStore = (function (_Store) {
  function TestStore(flux) {
    _classCallCheck(this, TestStore);

    _get(Object.getPrototypeOf(TestStore.prototype), "constructor", this).call(this);

    var testActions = flux.getActions("test");
    this.register(testActions.getSomething, this.handleGetSomething);

    this.state = {
      something: null
    };
  }

  _inherits(TestStore, _Store);

  _createClass(TestStore, {
    handleGetSomething: {
      value: function handleGetSomething(something) {
        this.setState({ something: something });
      }
    }
  });

  return TestStore;
})(Store);

var Flux = (function (_Flummox) {
  function Flux() {
    _classCallCheck(this, Flux);

    _get(Object.getPrototypeOf(Flux.prototype), "constructor", this).call(this);

    this.createActions("test", TestActions);
    this.createStore("test", TestStore, this);
  }

  _inherits(Flux, _Flummox);

  return Flux;
})(Flummox);

describe("connectToStores (HoC)", function () {
  it("gets Flux from either props or context", function () {
    var flux = new Flux();
    var contextComponent = undefined,
        propsComponent = undefined;

    var BaseComponent = (function (_React$Component) {
      function BaseComponent() {
        _classCallCheck(this, BaseComponent);

        if (_React$Component != null) {
          _React$Component.apply(this, arguments);
        }
      }

      _inherits(BaseComponent, _React$Component);

      _createClass(BaseComponent, {
        render: {
          value: function render() {
            return React.createElement("div", null);
          }
        }
      });

      return BaseComponent;
    })(React.Component);

    var ConnectedComponent = connectToStores(BaseComponent, "test");

    var ContextComponent = addContext(ConnectedComponent, { flux: flux }, { flux: React.PropTypes.instanceOf(Flummox) });

    var tree = TestUtils.renderIntoDocument(React.createElement(ContextComponent, null));

    contextComponent = TestUtils.findRenderedComponentWithType(tree, ConnectedComponent);

    propsComponent = TestUtils.renderIntoDocument(React.createElement(ConnectedComponent, { flux: flux }));

    expect(contextComponent.flux).to.be.an["instanceof"](Flummox);
    expect(propsComponent.flux).to.be.an["instanceof"](Flummox);
  });

  it("syncs with store after state change", function () {
    var flux = new Flux();

    var BaseComponent = (function (_React$Component) {
      function BaseComponent() {
        _classCallCheck(this, BaseComponent);

        if (_React$Component != null) {
          _React$Component.apply(this, arguments);
        }
      }

      _inherits(BaseComponent, _React$Component);

      _createClass(BaseComponent, {
        render: {
          value: function render() {
            return React.createElement("div", null);
          }
        }
      });

      return BaseComponent;
    })(React.Component);

    var ConnectedComponent = connectToStores(BaseComponent, "test");

    var tree = TestUtils.renderIntoDocument(React.createElement(ConnectedComponent, { flux: flux }));

    var component = TestUtils.findRenderedComponentWithType(tree, BaseComponent);

    var getSomething = flux.getActions("test").getSomething;

    expect(component.props.something).to.be["null"];

    getSomething("do");

    expect(component.props.something).to.equal("do");

    getSomething("re");

    expect(component.props.something).to.equal("re");
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hZGRvbnMvX190ZXN0c19fL2Nvbm5lY3RUb1N0b3Jlcy10ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFPLGVBQWUsMkJBQU0sb0JBQW9COztJQUN6QyxVQUFVLDJCQUFNLGNBQWM7O29CQUNHLFlBQVk7O0lBQTNDLE9BQU8sU0FBUCxPQUFPO0lBQUUsS0FBSyxTQUFMLEtBQUs7SUFBRSxPQUFPLFNBQVAsT0FBTzs7SUFDekIsS0FBSywyQkFBTSxjQUFjOztJQUN4QixTQUFTLEdBQUssS0FBSyxDQUFuQixTQUFTO0lBQ1QsU0FBUyxHQUFLLEtBQUssQ0FBQyxNQUFNLENBQTFCLFNBQVM7O0lBRVgsV0FBVztXQUFYLFdBQVc7MEJBQVgsV0FBVzs7Ozs7OztZQUFYLFdBQVc7O2VBQVgsV0FBVztBQUNmLGdCQUFZO2FBQUEsc0JBQUMsU0FBUyxFQUFFO0FBQ3RCLGVBQU8sU0FBUyxDQUFDO09BQ2xCOzs7O1NBSEcsV0FBVztHQUFTLE9BQU87O0lBTTNCLFNBQVM7QUFDRixXQURQLFNBQVMsQ0FDRCxJQUFJLEVBQUU7MEJBRGQsU0FBUzs7QUFFWCwrQkFGRSxTQUFTLDZDQUVIOztBQUVSLFFBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUMsUUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUVqRSxRQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsZUFBUyxFQUFFLElBQUk7S0FDaEIsQ0FBQztHQUNIOztZQVZHLFNBQVM7O2VBQVQsU0FBUztBQVliLHNCQUFrQjthQUFBLDRCQUFDLFNBQVMsRUFBRTtBQUM1QixZQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsU0FBUyxFQUFULFNBQVMsRUFBRSxDQUFDLENBQUM7T0FDOUI7Ozs7U0FkRyxTQUFTO0dBQVMsS0FBSzs7SUFpQnZCLElBQUk7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QUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWpELGdCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRW5CLFVBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDbEQsQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6InNyYy9hZGRvbnMvX190ZXN0c19fL2Nvbm5lY3RUb1N0b3Jlcy10ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbm5lY3RUb1N0b3JlcyBmcm9tICcuLi9jb25uZWN0VG9TdG9yZXMnO1xuaW1wb3J0IGFkZENvbnRleHQgZnJvbSAnLi9hZGRDb250ZXh0JztcbmltcG9ydCB7IEFjdGlvbnMsIFN0b3JlLCBGbHVtbW94IH0gZnJvbSAnLi4vLi4vRmx1eCc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QvYWRkb25zJztcbmNvbnN0IHsgUHJvcFR5cGVzIH0gPSBSZWFjdDtcbmNvbnN0IHsgVGVzdFV0aWxzIH0gPSBSZWFjdC5hZGRvbnM7XG5cbmNsYXNzIFRlc3RBY3Rpb25zIGV4dGVuZHMgQWN0aW9ucyB7XG4gIGdldFNvbWV0aGluZyhzb21ldGhpbmcpIHtcbiAgICByZXR1cm4gc29tZXRoaW5nO1xuICB9XG59XG5cbmNsYXNzIFRlc3RTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgY29uc3RydWN0b3IoZmx1eCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBjb25zdCB0ZXN0QWN0aW9ucyA9IGZsdXguZ2V0QWN0aW9ucygndGVzdCcpO1xuICAgIHRoaXMucmVnaXN0ZXIodGVzdEFjdGlvbnMuZ2V0U29tZXRoaW5nLCB0aGlzLmhhbmRsZUdldFNvbWV0aGluZyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgc29tZXRoaW5nOiBudWxsXG4gICAgfTtcbiAgfVxuXG4gIGhhbmRsZUdldFNvbWV0aGluZyhzb21ldGhpbmcpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgc29tZXRoaW5nIH0pO1xuICB9XG59XG5cbmNsYXNzIEZsdXggZXh0ZW5kcyBGbHVtbW94IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuY3JlYXRlQWN0aW9ucygndGVzdCcsIFRlc3RBY3Rpb25zKTtcbiAgICB0aGlzLmNyZWF0ZVN0b3JlKCd0ZXN0JywgVGVzdFN0b3JlLCB0aGlzKTtcbiAgfVxufVxuXG5kZXNjcmliZSgnY29ubmVjdFRvU3RvcmVzIChIb0MpJywgKCkgPT4ge1xuICBpdCgnZ2V0cyBGbHV4IGZyb20gZWl0aGVyIHByb3BzIG9yIGNvbnRleHQnLCAoKSA9PiB7XG4gICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgbGV0IGNvbnRleHRDb21wb25lbnQsIHByb3BzQ29tcG9uZW50O1xuXG4gICAgY2xhc3MgQmFzZUNvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiA8ZGl2Lz47XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgQ29ubmVjdGVkQ29tcG9uZW50ID0gY29ubmVjdFRvU3RvcmVzKEJhc2VDb21wb25lbnQsICd0ZXN0Jyk7XG5cbiAgICBjb25zdCBDb250ZXh0Q29tcG9uZW50ID0gYWRkQ29udGV4dChcbiAgICAgIENvbm5lY3RlZENvbXBvbmVudCxcbiAgICAgIHsgZmx1eCB9LFxuICAgICAgeyBmbHV4OiBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihGbHVtbW94KSB9XG4gICAgKTtcblxuICAgIGNvbnN0IHRyZWUgPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgPENvbnRleHRDb21wb25lbnQgLz5cbiAgICApO1xuXG4gICAgY29udGV4dENvbXBvbmVudCA9IFRlc3RVdGlscy5maW5kUmVuZGVyZWRDb21wb25lbnRXaXRoVHlwZShcbiAgICAgIHRyZWUsIENvbm5lY3RlZENvbXBvbmVudFxuICAgICk7XG5cbiAgICBwcm9wc0NvbXBvbmVudCA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICA8Q29ubmVjdGVkQ29tcG9uZW50IGZsdXg9e2ZsdXh9IC8+XG4gICAgKTtcblxuICAgIGV4cGVjdChjb250ZXh0Q29tcG9uZW50LmZsdXgpLnRvLmJlLmFuLmluc3RhbmNlb2YoRmx1bW1veCk7XG4gICAgZXhwZWN0KHByb3BzQ29tcG9uZW50LmZsdXgpLnRvLmJlLmFuLmluc3RhbmNlb2YoRmx1bW1veCk7XG4gIH0pO1xuXG4gIGl0KCdzeW5jcyB3aXRoIHN0b3JlIGFmdGVyIHN0YXRlIGNoYW5nZScsICgpID0+IHtcbiAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcblxuICAgIGNsYXNzIEJhc2VDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gPGRpdi8+O1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IENvbm5lY3RlZENvbXBvbmVudCA9IGNvbm5lY3RUb1N0b3JlcyhCYXNlQ29tcG9uZW50LCAndGVzdCcpO1xuXG4gICAgY29uc3QgdHJlZSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICA8Q29ubmVjdGVkQ29tcG9uZW50IGZsdXg9e2ZsdXh9IC8+XG4gICAgKTtcblxuICAgIGNvbnN0IGNvbXBvbmVudCA9IFRlc3RVdGlscy5maW5kUmVuZGVyZWRDb21wb25lbnRXaXRoVHlwZShcbiAgICAgIHRyZWUsIEJhc2VDb21wb25lbnRcbiAgICApO1xuXG4gICAgY29uc3QgZ2V0U29tZXRoaW5nID0gZmx1eC5nZXRBY3Rpb25zKCd0ZXN0JykuZ2V0U29tZXRoaW5nO1xuXG4gICAgZXhwZWN0KGNvbXBvbmVudC5wcm9wcy5zb21ldGhpbmcpLnRvLmJlLm51bGw7XG5cbiAgICBnZXRTb21ldGhpbmcoJ2RvJyk7XG5cbiAgICBleHBlY3QoY29tcG9uZW50LnByb3BzLnNvbWV0aGluZykudG8uZXF1YWwoJ2RvJyk7XG5cbiAgICBnZXRTb21ldGhpbmcoJ3JlJyk7XG5cbiAgICBleHBlY3QoY29tcG9uZW50LnByb3BzLnNvbWV0aGluZykudG8uZXF1YWwoJ3JlJyk7XG4gIH0pO1xufSk7XG4iXX0=