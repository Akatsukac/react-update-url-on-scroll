'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollableLink = exports.default = exports.removeHash = exports.goToAnchor = exports.setMetaTags = exports.configureAnchors = exports.goToTop = undefined;

var _meta = require('./utils/meta');

Object.defineProperty(exports, 'setMetaTags', {
  enumerable: true,
  get: function get() {
    return _meta.setMetaTags;
  }
});

var _hash = require('./utils/hash');

Object.defineProperty(exports, 'goToAnchor', {
  enumerable: true,
  get: function get() {
    return _hash.updateHash;
  }
});
Object.defineProperty(exports, 'removeHash', {
  enumerable: true,
  get: function get() {
    return _hash.removeHash;
  }
});

var _ScrollableSection = require('./ScrollableSection');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ScrollableSection).default;
  }
});
Object.defineProperty(exports, 'ScrollableLink', {
  enumerable: true,
  get: function get() {
    return _ScrollableSection.ScrollableLink;
  }
});

var _Manager = require('./Manager');

var _Manager2 = _interopRequireDefault(_Manager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var goToTop = exports.goToTop = _Manager2.default.goToTop;
var configureAnchors = exports.configureAnchors = _Manager2.default.configure;