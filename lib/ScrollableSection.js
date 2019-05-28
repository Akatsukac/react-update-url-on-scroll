'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollableLink = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Manager = require('./Manager');

var _Manager2 = _interopRequireDefault(_Manager);

var _func = require('./utils/func');

var _hash = require('./utils/hash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScrollableSection = function (_Component) {
  _inherits(ScrollableSection, _Component);

  function ScrollableSection(props) {
    _classCallCheck(this, ScrollableSection);

    var _this = _possibleConstructorReturn(this, (ScrollableSection.__proto__ || Object.getPrototypeOf(ScrollableSection)).call(this, props));

    _this.name = (props.name || '').replace(/^\//, '') || null;
    _this.hash = (props.hash || '').replace(/^\#/, '') || props.children.ref || null;
    _this.meta = props.meta || null;
    _this.id = (0, _func.createId)({ name: _this.name, hash: _this.hash });
    return _this;
  }

  _createClass(ScrollableSection, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var element = _reactDom2.default.findDOMNode(this.refs[Object.keys(this.refs)[0]]);

      _Manager2.default.addAnchor({
        element: element,
        name: this.name,
        hash: this.hash,
        exact: !!this.props.exact,
        id: this.id,
        meta: this.meta
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _Manager2.default.removeAnchor(this.id);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          name = _props.name,
          hash = _props.hash,
          title = _props.title,
          formatTitle = _props.formatTitle,
          props = _objectWithoutProperties(_props, ['children', 'name', 'hash', 'title', 'formatTitle']);

      if (Array.isArray(children)) {
        return _react2.default.createElement(
          'div',
          _extends({ ref: this.id }, props),
          _react2.default.Children.map(children, function (child) {
            return _react2.default.cloneElement(child, {});
          })
        );
      }

      return _react2.default.cloneElement(children, _extends({
        ref: children.ref || this.id
      }, props));
    }
  }]);

  return ScrollableSection;
}(_react.Component);

ScrollableSection.propTypes = {
  children: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.array]),
  name: _propTypes2.default.string,
  hash: _propTypes2.default.string,
  onEnter: _propTypes2.default.func
};
exports.default = ScrollableSection;


ScrollableSection.defaultProps = {};

var ScrollableLink = exports.ScrollableLink = function (_Component2) {
  _inherits(ScrollableLink, _Component2);

  function ScrollableLink(props) {
    _classCallCheck(this, ScrollableLink);

    var _this2 = _possibleConstructorReturn(this, (ScrollableLink.__proto__ || Object.getPrototypeOf(ScrollableLink)).call(this, props));

    _this2.handleClick = _this2.handleClick.bind(_this2);
    return _this2;
  }

  _createClass(ScrollableLink, [{
    key: 'handleClick',
    value: function handleClick() {
      var href = this.props.href;


      if (href && href !== '/' && href !== '#') {
        var pathParts = href.split('#');
        var name = pathParts[0].replace(/^\//, '') || null;
        var hash = pathParts[1] || null;
        var id = (0, _func.createId)({ name: name, hash: hash });

        if (_Manager2.default.anchors[id]) {
          (0, _hash.updateHash)({
            anchor: _Manager2.default.anchors[id],
            affectHistory: false,
            manager: _Manager2.default
          });

          _Manager2.default.goToSection(id);
        }
      } else {
        (0, _hash.removeHash)({ manager: _Manager2.default });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var children = this.props.children;


      if (Array.isArray(children)) {
        return _react2.default.createElement(
          'span',
          { onClick: this.handleClick },
          _react2.default.Children.map(children, function (child) {
            return _react2.default.cloneElement(child, {});
          })
        );
      }

      return _react2.default.cloneElement(children, {
        onClick: this.handleClick
      });
    }
  }]);

  return ScrollableLink;
}(_react.Component);