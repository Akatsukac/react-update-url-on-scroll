'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultMetaTags = exports.setMetaTags = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _arrayFrom = require('array-from');

var _arrayFrom2 = _interopRequireDefault(_arrayFrom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var getMetaTagName = function getMetaTagName(item) {
  return item.getAttribute('name') || item.getAttribute('property');
};

var getMeta = function getMeta(metaName) {
  var metas = document.getElementsByTagName('meta');
  return (0, _arrayFrom2.default)(metas).find(function (item) {
    return getMetaTagName(item) === metaName;
  });
};

var setMetaTags = function setMetaTags() {
  var metaTagsList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var title = metaTagsList.title,
      metaTags = _objectWithoutProperties(metaTagsList, ['title']);

  if (title) {
    document.title = title;
  }

  Object.keys(metaTags).forEach(function (tagName) {
    var currentTag = getMeta(tagName);

    if (!metaTags[tagName]) {
      // remove meta tags
      if (currentTag) {
        currentTag.parentNode.removeChild(currentTag);
      }

      return;
    }

    if (currentTag) {
      // update a meta tag
      currentTag.setAttribute('content', metaTags[tagName]);
    } else {
      // create a meta tag
      var meta = document.createElement('meta');
      meta.name = tagName;
      meta.setAttribute('content', metaTags[tagName]);
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  });
};

exports.setMetaTags = setMetaTags;
var getDefaultMetaTags = exports.getDefaultMetaTags = function getDefaultMetaTags(metaTags) {
  if (metaTags) {
    return metaTags;
  }

  var metas = document.getElementsByTagName('meta');

  return (0, _arrayFrom2.default)(metas).reduce(function (acc, item) {
    return _extends({}, acc, _defineProperty({}, getMetaTagName(item), item.getAttribute('content')));
  }, { title: document.title });
};