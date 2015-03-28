"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _Flux = require("../../Flux");

var Flummox = _Flux.Flummox;
var Store = _Flux.Store;
var Actions = _Flux.Actions;

var addContext = _interopRequire(require("./addContext"));

var React = _interopRequire(require("react/addons"));

var TestUtils = React.addons.TestUtils;

var FluxComponent = _interopRequire(require("../FluxComponent"));

var sinon = _interopRequire(require("sinon"));

describe("FluxComponent", function () {
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

  it("gets Flux property from either props or context", function () {
    var flux = new Flux();
    var contextComponent = undefined,
        propsComponent = undefined;

    var ContextComponent = addContext(FluxComponent, { flux: flux }, { flux: React.PropTypes.instanceOf(Flummox) });

    var tree = TestUtils.renderIntoDocument(React.createElement(ContextComponent, null));

    contextComponent = TestUtils.findRenderedComponentWithType(tree, FluxComponent);

    propsComponent = TestUtils.renderIntoDocument(React.createElement(FluxComponent, { flux: flux }));

    expect(contextComponent.flux).to.be.an["instanceof"](Flummox);
    expect(propsComponent.flux).to.be.an["instanceof"](Flummox);
  });

  it("allows for FluxComponents through the tree via context", function () {
    var flux = new Flux();
    var actions = flux.getActions("test");

    var TopView = (function (_React$Component) {
      function TopView() {
        _classCallCheck(this, TopView);

        if (_React$Component != null) {
          _React$Component.apply(this, arguments);
        }
      }

      _inherits(TopView, _React$Component);

      _createClass(TopView, {
        render: {
          value: function render() {
            return React.createElement(
              FluxComponent,
              { flux: flux },
              React.createElement(SubView, null)
            );
          }
        }
      });

      return TopView;
    })(React.Component);

    var SubView = (function (_React$Component2) {
      function SubView() {
        _classCallCheck(this, SubView);

        if (_React$Component2 != null) {
          _React$Component2.apply(this, arguments);
        }
      }

      _inherits(SubView, _React$Component2);

      _createClass(SubView, {
        render: {
          value: function render() {
            return React.createElement(SubSubView, null);
          }
        }
      });

      return SubView;
    })(React.Component);

    var SubSubView = (function (_React$Component3) {
      function SubSubView() {
        _classCallCheck(this, SubSubView);

        if (_React$Component3 != null) {
          _React$Component3.apply(this, arguments);
        }
      }

      _inherits(SubSubView, _React$Component3);

      _createClass(SubSubView, {
        render: {
          value: function render() {
            return React.createElement(
              FluxComponent,
              { connectToStores: "test" },
              React.createElement("div", null)
            );
          }
        }
      });

      return SubSubView;
    })(React.Component);

    var tree = TestUtils.renderIntoDocument(React.createElement(TopView, null));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, "div");

    actions.getSomething("something good");
    expect(div.props.something).to.equal("something good");
  });

  it("passes connectToStore prop to reactComponentMethod connectToStores()", function () {
    var flux = new Flux();
    var actions = flux.getActions("test");

    var component = TestUtils.renderIntoDocument(React.createElement(FluxComponent, { flux: flux, connectToStores: "test" }));

    actions.getSomething("something good");
    expect(component.state.something).to.deep.equal("something good");
    actions.getSomething("something else");
    expect(component.state.something).to.deep.equal("something else");
  });

  it("passes stateGetter prop to reactComponentMethod connectToStores()", function () {
    var flux = new Flux();
    var actions = flux.getActions("test");
    var stateGetter = sinon.stub().returns({ fiz: "bin" });

    var component = TestUtils.renderIntoDocument(React.createElement(FluxComponent, { flux: flux, connectToStores: "test", stateGetter: stateGetter }));

    expect(component.state.fiz).to.equal("bin");
  });

  it("injects children with flux prop", function () {
    var flux = new Flux();
    var actions = flux.getActions("test");

    var tree = TestUtils.renderIntoDocument(React.createElement(
      FluxComponent,
      { flux: flux },
      React.createElement("div", null)
    ));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, "div");

    expect(div.props.flux).to.equal(flux);
  });

  it("injects children with props corresponding to component state", function () {
    var flux = new Flux();
    var actions = flux.getActions("test");

    var tree = TestUtils.renderIntoDocument(React.createElement(
      FluxComponent,
      { flux: flux, connectToStores: "test" },
      React.createElement("div", null)
    ));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, "div");

    actions.getSomething("something good");
    expect(div.props.something).to.equal("something good");
    actions.getSomething("something else");
    expect(div.props.something).to.equal("something else");
  });

  it("injects children with any extra props", function () {
    var flux = new Flux();
    var stateGetter = function () {};

    // Pass all possible PropTypes to ensure only extra props
    // are injected.
    var tree = TestUtils.renderIntoDocument(React.createElement(FluxComponent, {
      flux: flux,
      connectToStores: "test",
      stateGetter: stateGetter,
      extraProp: "hello",
      render: function (props) {
        return React.createElement("div", props);
      }
    }));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, "div");

    expect(div.props.extraProp).to.equal("hello");
    expect(Object.keys(div.props)).to.deep.equal(["flux", "extraProp"]);
  });

  it("wraps multiple children in span tag", function () {
    var flux = new Flux();

    var tree = TestUtils.renderIntoDocument(React.createElement(
      FluxComponent,
      { flux: flux },
      React.createElement("div", null),
      React.createElement("div", null)
    ));

    var wrapper = TestUtils.findRenderedDOMComponentWithTag(tree, "span");
    var divs = TestUtils.scryRenderedDOMComponentsWithTag(tree, "div");

    expect(divs.length).to.equal(2);
  });

  it("does not wrap single child in span tag", function () {
    var flux = new Flux();

    var tree = TestUtils.renderIntoDocument(React.createElement(
      FluxComponent,
      { flux: flux },
      React.createElement("div", null)
    ));

    expect(TestUtils.findRenderedDOMComponentWithTag.bind(TestUtils, tree, "span")).to["throw"]("Did not find exactly one match for tag:span");
  });

  it("allows for nested FluxComponents", function () {
    var flux = new Flux();
    var actions = flux.getActions("test");

    var tree = TestUtils.renderIntoDocument(React.createElement(
      FluxComponent,
      { flux: flux, connectToStores: "test" },
      React.createElement(
        FluxComponent,
        null,
        React.createElement("div", null)
      )
    ));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, "div");

    actions.getSomething("something good");
    expect(div.props.something).to.equal("something good");
    actions.getSomething("something else");
    expect(div.props.something).to.equal("something else");
  });

  it("uses `render` prop for custom rendering, if it exists", function () {
    var flux = new Flux();
    var actions = flux.getActions("test");

    var tree = TestUtils.renderIntoDocument(React.createElement(FluxComponent, {
      flux: flux,
      connectToStores: "test",
      render: function (props) {
        return React.createElement("div", { something: props.something });
      }
    }));

    var div = TestUtils.findRenderedDOMComponentWithTag(tree, "div");

    actions.getSomething("something good");
    expect(div.props.something).to.equal("something good");
    actions.getSomething("something else");
    expect(div.props.something).to.equal("something else");
  });

  it("updates with render-time computed values in state getters on componentWillReceiveProps()", function () {
    var flux = new Flux();

    var Owner = (function (_React$Component) {
      function Owner(props) {
        _classCallCheck(this, Owner);

        _get(Object.getPrototypeOf(Owner.prototype), "constructor", this).call(this, props);

        this.state = {
          foo: "bar"
        };
      }

      _inherits(Owner, _React$Component);

      _createClass(Owner, {
        render: {
          value: function render() {
            var _this = this;

            return React.createElement(FluxComponent, {
              flux: flux,
              connectToStores: {
                test: function (store) {
                  return {
                    yay: _this.state.foo
                  };
                }
              },
              render: function (storeState) {
                return React.createElement("div", storeState);
              }
            });
          }
        }
      });

      return Owner;
    })(React.Component);

    var owner = TestUtils.renderIntoDocument(React.createElement(Owner, null));
    var div = TestUtils.findRenderedDOMComponentWithTag(owner, "div");

    expect(div.props.yay).to.equal("bar");
    owner.setState({ foo: "baz" });
    expect(div.props.yay).to.equal("baz");
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hZGRvbnMvX190ZXN0c19fL0ZsdXhDb21wb25lbnQtdGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBQXdDLFlBQVk7O0lBQTNDLE9BQU8sU0FBUCxPQUFPO0lBQUUsS0FBSyxTQUFMLEtBQUs7SUFBRSxPQUFPLFNBQVAsT0FBTzs7SUFDekIsVUFBVSwyQkFBTSxjQUFjOztJQUU5QixLQUFLLDJCQUFNLGNBQWM7O0lBQ3hCLFNBQVMsR0FBSyxLQUFLLENBQUMsTUFBTSxDQUExQixTQUFTOztJQUVWLGFBQWEsMkJBQU0sa0JBQWtCOztJQUNyQyxLQUFLLDJCQUFNLE9BQU87O0FBRXpCLFFBQVEsQ0FBQyxlQUFlLEVBQUUsWUFBTTtNQUV4QixXQUFXO2FBQVgsV0FBVzs0QkFBWCxXQUFXOzs7Ozs7O2NBQVgsV0FBVzs7aUJBQVgsV0FBVztBQUNmLGtCQUFZO2VBQUEsc0JBQUMsU0FBUyxFQUFFO0FBQ3RCLGlCQUFPLFNBQVMsQ0FBQztTQUNsQjs7OztXQUhHLFdBQVc7S0FBUyxPQUFPOztNQU0zQixTQUFTO0FBQ0YsYUFEUCxTQUFTLENBQ0QsSUFBSSxFQUFFOzRCQURkLFNBQVM7O0FBRVgsaUNBRkUsU0FBUyw2Q0FFSDs7QUFFUixVQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVDLFVBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7QUFFakUsVUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLGlCQUFTLEVBQUUsSUFBSTtPQUNoQixDQUFDO0tBQ0g7O2NBVkcsU0FBUzs7aUJBQVQsU0FBUztBQVliLHdCQUFrQjtlQUFBLDRCQUFDLFNBQVMsRUFBRTtBQUM1QixjQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsU0FBUyxFQUFULFNBQVMsRUFBRSxDQUFDLENBQUM7U0FDOUI7Ozs7V0FkRyxT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QUM7QUFDdEQsUUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLCtCQUErQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFcEUsVUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QyxTQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDL0IsVUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUN2QyxDQUFDLENBQUM7Q0FFSixDQUFDLENBQUMiLCJmaWxlIjoic3JjL2FkZG9ucy9fX3Rlc3RzX18vRmx1eENvbXBvbmVudC10ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRmx1bW1veCwgU3RvcmUsIEFjdGlvbnMgfSBmcm9tICcuLi8uLi9GbHV4JztcbmltcG9ydCBhZGRDb250ZXh0IGZyb20gJy4vYWRkQ29udGV4dCc7XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdC9hZGRvbnMnO1xuY29uc3QgeyBUZXN0VXRpbHMgfSA9IFJlYWN0LmFkZG9ucztcblxuaW1wb3J0IEZsdXhDb21wb25lbnQgZnJvbSAnLi4vRmx1eENvbXBvbmVudCc7XG5pbXBvcnQgc2lub24gZnJvbSAnc2lub24nO1xuXG5kZXNjcmliZSgnRmx1eENvbXBvbmVudCcsICgpID0+IHtcblxuICBjbGFzcyBUZXN0QWN0aW9ucyBleHRlbmRzIEFjdGlvbnMge1xuICAgIGdldFNvbWV0aGluZyhzb21ldGhpbmcpIHtcbiAgICAgIHJldHVybiBzb21ldGhpbmc7XG4gICAgfVxuICB9XG5cbiAgY2xhc3MgVGVzdFN0b3JlIGV4dGVuZHMgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKGZsdXgpIHtcbiAgICAgIHN1cGVyKCk7XG5cbiAgICAgIGNvbnN0IHRlc3RBY3Rpb25zID0gZmx1eC5nZXRBY3Rpb25zKCd0ZXN0Jyk7XG4gICAgICB0aGlzLnJlZ2lzdGVyKHRlc3RBY3Rpb25zLmdldFNvbWV0aGluZywgdGhpcy5oYW5kbGVHZXRTb21ldGhpbmcpO1xuXG4gICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICBzb21ldGhpbmc6IG51bGxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaGFuZGxlR2V0U29tZXRoaW5nKHNvbWV0aGluZykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNvbWV0aGluZyB9KTtcbiAgICB9XG4gIH1cblxuICBjbGFzcyBGbHV4IGV4dGVuZHMgRmx1bW1veCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuXG4gICAgICB0aGlzLmNyZWF0ZUFjdGlvbnMoJ3Rlc3QnLCBUZXN0QWN0aW9ucyk7XG4gICAgICB0aGlzLmNyZWF0ZVN0b3JlKCd0ZXN0JywgVGVzdFN0b3JlLCB0aGlzKTtcbiAgICB9XG4gIH1cblxuICBpdCgnZ2V0cyBGbHV4IHByb3BlcnR5IGZyb20gZWl0aGVyIHByb3BzIG9yIGNvbnRleHQnLCAoKSA9PiB7XG4gICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgbGV0IGNvbnRleHRDb21wb25lbnQsIHByb3BzQ29tcG9uZW50O1xuXG4gICAgY29uc3QgQ29udGV4dENvbXBvbmVudCA9IGFkZENvbnRleHQoXG4gICAgICBGbHV4Q29tcG9uZW50LFxuICAgICAgeyBmbHV4IH0sXG4gICAgICB7IGZsdXg6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEZsdW1tb3gpIH1cbiAgICApO1xuXG4gICAgY29uc3QgdHJlZSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoPENvbnRleHRDb21wb25lbnQgLz4pO1xuXG4gICAgY29udGV4dENvbXBvbmVudCA9IFRlc3RVdGlscy5maW5kUmVuZGVyZWRDb21wb25lbnRXaXRoVHlwZShcbiAgICAgIHRyZWUsIEZsdXhDb21wb25lbnRcbiAgICApO1xuXG4gICAgcHJvcHNDb21wb25lbnQgPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgPEZsdXhDb21wb25lbnQgZmx1eD17Zmx1eH0gLz5cbiAgICApO1xuXG4gICAgZXhwZWN0KGNvbnRleHRDb21wb25lbnQuZmx1eCkudG8uYmUuYW4uaW5zdGFuY2VvZihGbHVtbW94KTtcbiAgICBleHBlY3QocHJvcHNDb21wb25lbnQuZmx1eCkudG8uYmUuYW4uaW5zdGFuY2VvZihGbHVtbW94KTtcbiAgfSk7XG5cbiAgaXQoJ2FsbG93cyBmb3IgRmx1eENvbXBvbmVudHMgdGhyb3VnaCB0aGUgdHJlZSB2aWEgY29udGV4dCcsICgpID0+IHtcbiAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICBjb25zdCBhY3Rpb25zID0gZmx1eC5nZXRBY3Rpb25zKCd0ZXN0Jyk7XG5cbiAgICBjbGFzcyBUb3BWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8Rmx1eENvbXBvbmVudCBmbHV4PXtmbHV4fT5cbiAgICAgICAgICAgIDxTdWJWaWV3IC8+XG4gICAgICAgICAgPC9GbHV4Q29tcG9uZW50PlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNsYXNzIFN1YlZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gPFN1YlN1YlZpZXcgLz47XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3MgU3ViU3ViVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEZsdXhDb21wb25lbnQgY29ubmVjdFRvU3RvcmVzPVwidGVzdFwiPlxuICAgICAgICAgICAgPGRpdiAvPlxuICAgICAgICAgIDwvRmx1eENvbXBvbmVudD5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB0cmVlID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIDxUb3BWaWV3IC8+XG4gICAgKTtcblxuICAgIGNvbnN0IGRpdiA9IFRlc3RVdGlscy5maW5kUmVuZGVyZWRET01Db21wb25lbnRXaXRoVGFnKHRyZWUsICdkaXYnKTtcblxuICAgIGFjdGlvbnMuZ2V0U29tZXRoaW5nKCdzb21ldGhpbmcgZ29vZCcpO1xuICAgIGV4cGVjdChkaXYucHJvcHMuc29tZXRoaW5nKS50by5lcXVhbCgnc29tZXRoaW5nIGdvb2QnKTtcbiAgfSk7XG5cbiAgaXQoJ3Bhc3NlcyBjb25uZWN0VG9TdG9yZSBwcm9wIHRvIHJlYWN0Q29tcG9uZW50TWV0aG9kIGNvbm5lY3RUb1N0b3JlcygpJywgKCkgPT4ge1xuICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgIGNvbnN0IGFjdGlvbnMgPSBmbHV4LmdldEFjdGlvbnMoJ3Rlc3QnKTtcblxuICAgIGNvbnN0IGNvbXBvbmVudCA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICA8Rmx1eENvbXBvbmVudCBmbHV4PXtmbHV4fSBjb25uZWN0VG9TdG9yZXM9XCJ0ZXN0XCIgLz5cbiAgICApO1xuXG4gICAgYWN0aW9ucy5nZXRTb21ldGhpbmcoJ3NvbWV0aGluZyBnb29kJyk7XG4gICAgZXhwZWN0KGNvbXBvbmVudC5zdGF0ZS5zb21ldGhpbmcpLnRvLmRlZXAuZXF1YWwoJ3NvbWV0aGluZyBnb29kJyk7XG4gICAgYWN0aW9ucy5nZXRTb21ldGhpbmcoJ3NvbWV0aGluZyBlbHNlJyk7XG4gICAgZXhwZWN0KGNvbXBvbmVudC5zdGF0ZS5zb21ldGhpbmcpLnRvLmRlZXAuZXF1YWwoJ3NvbWV0aGluZyBlbHNlJyk7XG4gIH0pO1xuXG4gIGl0KCdwYXNzZXMgc3RhdGVHZXR0ZXIgcHJvcCB0byByZWFjdENvbXBvbmVudE1ldGhvZCBjb25uZWN0VG9TdG9yZXMoKScsICgpID0+IHtcbiAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICBjb25zdCBhY3Rpb25zID0gZmx1eC5nZXRBY3Rpb25zKCd0ZXN0Jyk7XG4gICAgY29uc3Qgc3RhdGVHZXR0ZXIgPSBzaW5vbi5zdHViKCkucmV0dXJucyh7IGZpejogJ2JpbicgfSk7XG5cbiAgICBjb25zdCBjb21wb25lbnQgPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgPEZsdXhDb21wb25lbnQgZmx1eD17Zmx1eH0gY29ubmVjdFRvU3RvcmVzPVwidGVzdFwiIHN0YXRlR2V0dGVyPXtzdGF0ZUdldHRlcn0gLz5cbiAgICApO1xuXG4gICAgZXhwZWN0KGNvbXBvbmVudC5zdGF0ZS5maXopLnRvLmVxdWFsKCdiaW4nKTtcbiAgfSk7XG5cbiAgaXQoJ2luamVjdHMgY2hpbGRyZW4gd2l0aCBmbHV4IHByb3AnLCAoKSA9PiB7XG4gICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgY29uc3QgYWN0aW9ucyA9IGZsdXguZ2V0QWN0aW9ucygndGVzdCcpO1xuXG4gICAgY29uc3QgdHJlZSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICA8Rmx1eENvbXBvbmVudCBmbHV4PXtmbHV4fT5cbiAgICAgICAgPGRpdiAvPlxuICAgICAgPC9GbHV4Q29tcG9uZW50PlxuICAgICk7XG5cbiAgICBjb25zdCBkaXYgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZyh0cmVlLCAnZGl2Jyk7XG5cbiAgICBleHBlY3QoZGl2LnByb3BzLmZsdXgpLnRvLmVxdWFsKGZsdXgpO1xuICB9KTtcblxuICBpdCgnaW5qZWN0cyBjaGlsZHJlbiB3aXRoIHByb3BzIGNvcnJlc3BvbmRpbmcgdG8gY29tcG9uZW50IHN0YXRlJywgKCkgPT4ge1xuICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgIGNvbnN0IGFjdGlvbnMgPSBmbHV4LmdldEFjdGlvbnMoJ3Rlc3QnKTtcblxuICAgIGNvbnN0IHRyZWUgPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgPEZsdXhDb21wb25lbnQgZmx1eD17Zmx1eH0gY29ubmVjdFRvU3RvcmVzPVwidGVzdFwiPlxuICAgICAgICA8ZGl2IC8+XG4gICAgICA8L0ZsdXhDb21wb25lbnQ+XG4gICAgKTtcblxuICAgIGNvbnN0IGRpdiA9IFRlc3RVdGlscy5maW5kUmVuZGVyZWRET01Db21wb25lbnRXaXRoVGFnKHRyZWUsICdkaXYnKTtcblxuICAgIGFjdGlvbnMuZ2V0U29tZXRoaW5nKCdzb21ldGhpbmcgZ29vZCcpO1xuICAgIGV4cGVjdChkaXYucHJvcHMuc29tZXRoaW5nKS50by5lcXVhbCgnc29tZXRoaW5nIGdvb2QnKTtcbiAgICBhY3Rpb25zLmdldFNvbWV0aGluZygnc29tZXRoaW5nIGVsc2UnKTtcbiAgICBleHBlY3QoZGl2LnByb3BzLnNvbWV0aGluZykudG8uZXF1YWwoJ3NvbWV0aGluZyBlbHNlJyk7XG4gIH0pO1xuXG4gIGl0KCdpbmplY3RzIGNoaWxkcmVuIHdpdGggYW55IGV4dHJhIHByb3BzJywgKCkgPT4ge1xuICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgIGNvbnN0IHN0YXRlR2V0dGVyID0gKCkgPT4ge307XG5cbiAgICAvLyBQYXNzIGFsbCBwb3NzaWJsZSBQcm9wVHlwZXMgdG8gZW5zdXJlIG9ubHkgZXh0cmEgcHJvcHNcbiAgICAvLyBhcmUgaW5qZWN0ZWQuXG4gICAgY29uc3QgdHJlZSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICA8Rmx1eENvbXBvbmVudFxuICAgICAgICBmbHV4PXtmbHV4fVxuICAgICAgICBjb25uZWN0VG9TdG9yZXM9XCJ0ZXN0XCJcbiAgICAgICAgc3RhdGVHZXR0ZXI9e3N0YXRlR2V0dGVyfVxuICAgICAgICBleHRyYVByb3A9XCJoZWxsb1wiXG4gICAgICAgIHJlbmRlcj17KHByb3BzKSA9PiA8ZGl2IHsuLi5wcm9wc30gLz59XG4gICAgICAvPlxuICAgICk7XG5cbiAgICBjb25zdCBkaXYgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZyh0cmVlLCAnZGl2Jyk7XG5cbiAgICBleHBlY3QoZGl2LnByb3BzLmV4dHJhUHJvcCkudG8uZXF1YWwoJ2hlbGxvJyk7XG4gICAgZXhwZWN0KE9iamVjdC5rZXlzKGRpdi5wcm9wcykpLnRvLmRlZXAuZXF1YWwoWydmbHV4JywgJ2V4dHJhUHJvcCddKTtcbiAgfSk7XG5cbiAgaXQoJ3dyYXBzIG11bHRpcGxlIGNoaWxkcmVuIGluIHNwYW4gdGFnJywgKCkgPT4ge1xuICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuXG4gICAgY29uc3QgdHJlZSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICA8Rmx1eENvbXBvbmVudCBmbHV4PXtmbHV4fT5cbiAgICAgICAgPGRpdiAvPlxuICAgICAgICA8ZGl2IC8+XG4gICAgICA8L0ZsdXhDb21wb25lbnQ+XG4gICAgKTtcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZyh0cmVlLCAnc3BhbicpO1xuICAgIGNvbnN0IGRpdnMgPSBUZXN0VXRpbHMuc2NyeVJlbmRlcmVkRE9NQ29tcG9uZW50c1dpdGhUYWcodHJlZSwgJ2RpdicpO1xuXG4gICAgZXhwZWN0KGRpdnMubGVuZ3RoKS50by5lcXVhbCgyKTtcbiAgfSk7XG5cbiAgaXQoJ2RvZXMgbm90IHdyYXAgc2luZ2xlIGNoaWxkIGluIHNwYW4gdGFnJywgKCkgPT4ge1xuICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuXG4gICAgY29uc3QgdHJlZSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICA8Rmx1eENvbXBvbmVudCBmbHV4PXtmbHV4fT5cbiAgICAgICAgPGRpdiAvPlxuICAgICAgPC9GbHV4Q29tcG9uZW50PlxuICAgICk7XG5cbiAgICBleHBlY3QoXG4gICAgICBUZXN0VXRpbHMuZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZy5iaW5kKFRlc3RVdGlscywgdHJlZSwgJ3NwYW4nKVxuICAgICkudG8udGhyb3coJ0RpZCBub3QgZmluZCBleGFjdGx5IG9uZSBtYXRjaCBmb3IgdGFnOnNwYW4nKTtcbiAgfSk7XG5cbiAgaXQoJ2FsbG93cyBmb3IgbmVzdGVkIEZsdXhDb21wb25lbnRzJywgKCkgPT4ge1xuICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgIGNvbnN0IGFjdGlvbnMgPSBmbHV4LmdldEFjdGlvbnMoJ3Rlc3QnKTtcblxuICAgIGNvbnN0IHRyZWUgPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgPEZsdXhDb21wb25lbnQgZmx1eD17Zmx1eH0gY29ubmVjdFRvU3RvcmVzPVwidGVzdFwiPlxuICAgICAgICA8Rmx1eENvbXBvbmVudD5cbiAgICAgICAgICA8ZGl2IC8+XG4gICAgICAgIDwvRmx1eENvbXBvbmVudD5cbiAgICAgIDwvRmx1eENvbXBvbmVudD5cbiAgICApO1xuXG4gICAgY29uc3QgZGl2ID0gVGVzdFV0aWxzLmZpbmRSZW5kZXJlZERPTUNvbXBvbmVudFdpdGhUYWcodHJlZSwgJ2RpdicpO1xuXG4gICAgYWN0aW9ucy5nZXRTb21ldGhpbmcoJ3NvbWV0aGluZyBnb29kJyk7XG4gICAgZXhwZWN0KGRpdi5wcm9wcy5zb21ldGhpbmcpLnRvLmVxdWFsKCdzb21ldGhpbmcgZ29vZCcpO1xuICAgIGFjdGlvbnMuZ2V0U29tZXRoaW5nKCdzb21ldGhpbmcgZWxzZScpO1xuICAgIGV4cGVjdChkaXYucHJvcHMuc29tZXRoaW5nKS50by5lcXVhbCgnc29tZXRoaW5nIGVsc2UnKTtcbiAgfSk7XG5cbiAgaXQoJ3VzZXMgYHJlbmRlcmAgcHJvcCBmb3IgY3VzdG9tIHJlbmRlcmluZywgaWYgaXQgZXhpc3RzJywgKCkgPT4ge1xuICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgIGNvbnN0IGFjdGlvbnMgPSBmbHV4LmdldEFjdGlvbnMoJ3Rlc3QnKTtcblxuICAgIGNvbnN0IHRyZWUgPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgPEZsdXhDb21wb25lbnRcbiAgICAgICAgZmx1eD17Zmx1eH1cbiAgICAgICAgY29ubmVjdFRvU3RvcmVzPVwidGVzdFwiXG4gICAgICAgIHJlbmRlcj17cHJvcHMgPT5cbiAgICAgICAgICA8ZGl2IHNvbWV0aGluZz17cHJvcHMuc29tZXRoaW5nfSAvPlxuICAgICAgICB9XG4gICAgICAvPlxuICAgICk7XG5cbiAgICBjb25zdCBkaXYgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZyh0cmVlLCAnZGl2Jyk7XG5cbiAgICBhY3Rpb25zLmdldFNvbWV0aGluZygnc29tZXRoaW5nIGdvb2QnKTtcbiAgICBleHBlY3QoZGl2LnByb3BzLnNvbWV0aGluZykudG8uZXF1YWwoJ3NvbWV0aGluZyBnb29kJyk7XG4gICAgYWN0aW9ucy5nZXRTb21ldGhpbmcoJ3NvbWV0aGluZyBlbHNlJyk7XG4gICAgZXhwZWN0KGRpdi5wcm9wcy5zb21ldGhpbmcpLnRvLmVxdWFsKCdzb21ldGhpbmcgZWxzZScpO1xuICB9KTtcblxuICBpdCgndXBkYXRlcyB3aXRoIHJlbmRlci10aW1lIGNvbXB1dGVkIHZhbHVlcyBpbiBzdGF0ZSBnZXR0ZXJzIG9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoKScsICgpID0+IHtcbiAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcblxuICAgIGNsYXNzIE93bmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgIGZvbzogJ2JhcidcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxGbHV4Q29tcG9uZW50XG4gICAgICAgICAgICBmbHV4PXtmbHV4fVxuICAgICAgICAgICAgY29ubmVjdFRvU3RvcmVzPXt7XG4gICAgICAgICAgICAgIHRlc3Q6IHN0b3JlID0+ICh7XG4gICAgICAgICAgICAgICAgeWF5OiB0aGlzLnN0YXRlLmZvb1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIHJlbmRlcj17c3RvcmVTdGF0ZSA9PiA8ZGl2IHsuLi5zdG9yZVN0YXRlfSAvPn1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG93bmVyID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudCg8T3duZXIgLz4pO1xuICAgIGNvbnN0IGRpdiA9IFRlc3RVdGlscy5maW5kUmVuZGVyZWRET01Db21wb25lbnRXaXRoVGFnKG93bmVyLCAnZGl2Jyk7XG5cbiAgICBleHBlY3QoZGl2LnByb3BzLnlheSkudG8uZXF1YWwoJ2JhcicpO1xuICAgIG93bmVyLnNldFN0YXRlKHsgZm9vOiAnYmF6JyB9KTtcbiAgICBleHBlY3QoZGl2LnByb3BzLnlheSkudG8uZXF1YWwoJ2JheicpO1xuICB9KTtcblxufSk7XG4iXX0=