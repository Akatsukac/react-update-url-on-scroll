'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBestAnchorGivenScrollLocation = exports.checkElementRelevance = exports.checkLocationRelevance = exports.doesElementContainScrollTop = exports.getElementOffset = exports.getScrollTop = exports.scrollTo = undefined;

var _animatedScrollTo = require('animated-scroll-to');

var _animatedScrollTo2 = _interopRequireDefault(_animatedScrollTo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scrollTo = exports.scrollTo = function scrollTo(options) {
  var isIE = /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent);

  if (isIE) {
    (0, _animatedScrollTo2.default)(options.top, {
      speed: options.behavior === 'smooth' ? 500 : 0
    });
  } else {
    if (typeof window !== 'undefined') {
      window.scrollTo(options);
    }
  }
};

var getScrollTop = exports.getScrollTop = function getScrollTop() {
  if (typeof document !== 'undefined') {
    return document.body.scrollTop || document.documentElement.scrollTop;
  }
};

// get vertical offsets of element, taking scrollTop into consideration
var getElementOffset = exports.getElementOffset = function getElementOffset(element) {
  var scrollTop = getScrollTop();

  var _ref = element ? element.getBoundingClientRect() : { top: 0, bottom: 0 },
      top = _ref.top,
      bottom = _ref.bottom;

  return {
    top: Math.floor(top + scrollTop),
    bottom: Math.floor(bottom + scrollTop)
  };
};

// does scrollTop live within element bounds?
var doesElementContainScrollTop = exports.doesElementContainScrollTop = function doesElementContainScrollTop(element) {
  var extraOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var scrollTop = getScrollTop();
  var offsetTop = getElementOffset(element).top + extraOffset;
  return scrollTop >= offsetTop && scrollTop < offsetTop + element.offsetHeight;
};

// is el2's location more relevant than el2,
// parent-child relationship aside?
var checkLocationRelevance = exports.checkLocationRelevance = function checkLocationRelevance(el1, el2) {
  var _getElementOffset = getElementOffset(el1),
      top1 = _getElementOffset.top,
      bottom1 = _getElementOffset.bottom;

  var _getElementOffset2 = getElementOffset(el2),
      top2 = _getElementOffset2.top,
      bottom2 = _getElementOffset2.bottom;

  if (top1 === top2) {
    if (bottom1 === bottom2) {
      // top and bottom of compared elements are the same,
      // so return one randomly in a deterministic way
      return el1 < el2;
    }
    // top of compared elements is the same, so return whichever
    // element has its bottom higher on the page
    return bottom2 < bottom1;
  }
  // top of compared elements differ, so return true
  // if tested element has its top lower on the page
  return top2 > top1;
};

// check if el2 is more relevant than el1, considering child-parent
// relationships as well as node location.
var checkElementRelevance = exports.checkElementRelevance = function checkElementRelevance(el1, el2) {
  if (el1.contains(el2)) {
    // el2 is child, so it gains relevance priority
    return true;
  } else if (!el2.contains(el1) && checkLocationRelevance(el1, el2)) {
    // el1 and el2 are unrelated, but el2 has a better location,
    // so it gains relevance priority
    return true;
  }
  return false;
};

// given a set of anchors, find which one is, given the following logic:
// 1. children nodes are more relevant than parent nodes
// 2. if neither node contains the other, and their top locations differ,
//    the node with the top lower on the page is more relevant
// 3. if neither node contains the other, and their top locations are the same,
//    the node with the bottom higher on the page is more relevant
// 4. if neither node contains the other, and their top and bottom locations
//    are the same, a node is chosen at random, in a deterministic way,
//    to be more relevant.
var getBestAnchorGivenScrollLocation = exports.getBestAnchorGivenScrollLocation = function getBestAnchorGivenScrollLocation(anchors, offset) {
  var bestId = void 0,
      bestElement = void 0;

  Object.keys(anchors).forEach(function (id) {
    var element = anchors[id].component;
    if (doesElementContainScrollTop(element, offset)) {
      if (!bestElement || checkElementRelevance(bestElement, element)) {
        bestElement = element;
        bestId = id;
      }
    }
  });
  return bestId;
};