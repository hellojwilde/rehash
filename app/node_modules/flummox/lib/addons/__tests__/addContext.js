"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

module.exports = addContext;

var React = _interopRequire(require("react"));

function addContext(Component, context, contextTypes) {
  return React.createClass({
    childContextTypes: contextTypes,

    getChildContext: function getChildContext() {
      return context;
    },

    render: function render() {
      return React.createElement(Component, this.props);
    }
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hZGRvbnMvX190ZXN0c19fL2FkZENvbnRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztpQkFFd0IsVUFBVTs7SUFGM0IsS0FBSywyQkFBTSxPQUFPOztBQUVWLFNBQVMsVUFBVSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFO0FBQ25FLFNBQU8sS0FBSyxDQUFDLFdBQVcsQ0FBQztBQUN2QixxQkFBaUIsRUFBRSxZQUFZOztBQUUvQixtQkFBZSxFQUFBLDJCQUFHO0FBQ2hCLGFBQU8sT0FBTyxDQUFDO0tBQ2hCOztBQUVELFVBQU0sRUFBQSxrQkFBRztBQUNQLGFBQU8sb0JBQUMsU0FBUyxFQUFLLElBQUksQ0FBQyxLQUFLLENBQUksQ0FBQztLQUN0QztHQUNGLENBQUMsQ0FBQztDQUNKIiwiZmlsZSI6InNyYy9hZGRvbnMvX190ZXN0c19fL2FkZENvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRDb250ZXh0KENvbXBvbmVudCwgY29udGV4dCwgY29udGV4dFR5cGVzKSB7XG4gIHJldHVybiBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgY2hpbGRDb250ZXh0VHlwZXM6IGNvbnRleHRUeXBlcyxcblxuICAgIGdldENoaWxkQ29udGV4dCgpIHtcbiAgICAgIHJldHVybiBjb250ZXh0O1xuICAgIH0sXG5cbiAgICByZW5kZXIoKSB7XG4gICAgICByZXR1cm4gPENvbXBvbmVudCB7Li4udGhpcy5wcm9wc30gLz47XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==