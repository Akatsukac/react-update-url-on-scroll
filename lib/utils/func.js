'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _arguments = arguments;
var debounce = exports.debounce = function debounce(func, wait, immediate) {
  var timeout = void 0;
  return function () {
    var context = undefined;
    var args = _arguments;
    var later = function later() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
};

var createId = exports.createId = function createId(_ref) {
  var name = _ref.name,
      hash = _ref.hash;
  return '___scroll-section___' + (name || '') + '___' + (hash || '');
};

var getAnchoreByName = exports.getAnchoreByName = function getAnchoreByName() {
  var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var name = arguments[1];

  var key = Object.keys(object).find(function (key) {
    return object[key].name === name && !object[key].hash;
  });
  return key ? object[key] : null;
};