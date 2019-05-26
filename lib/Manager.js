'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _func = require('./utils/func');

var _scroll = require('./utils/scroll');

var _hash = require('./utils/hash');

var _meta = require('./utils/meta');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultConfig = {
  affectHistory: false,
  debounce: 100,
  keepLastAnchorHash: false,
  offset: 0,
  scrollBehaviour: 'smooth',
  scrollDelay: 0,
  scrollOnImagesLoad: false,
  onSectionEnter: null,
  meta: null,
  reloadOnGoingBack: false
};

var EVENT_IMAGES_LOADED = 'images:loaded';

var Manager = function Manager() {
  var _this = this;

  _classCallCheck(this, Manager);

  this.getBasePath = function (anchors) {
    var newBasePath = ('' + window.location.origin + window.location.pathname).replace(/\/$/, '');

    if (anchors) {
      Object.keys(anchors).forEach(function (id) {
        if (!anchors[id].exact && newBasePath.endsWith(anchors[id].name)) {
          newBasePath = newBasePath.replace('/' + anchors[id].name, '');
        }
      });
    }

    return newBasePath;
  };

  this.addListeners = function () {
    window.addEventListener('scroll', _this.scrollHandler, true);
    window.addEventListener('hashchange', _this.handleHashChange);
    /* window.addEventListener('onpopstate', this.getBasePath); */
  };

  this.removeListeners = function () {
    window.removeEventListener('scroll', _this.scrollHandler, true);
    window.removeEventListener('hashchange', _this.handleHashChange);
    /* window.addEventListener('onpopstate', this.getBasePath); */
  };

  this.configure = function (config) {
    _this.config = _extends({}, defaultConfig, config);
    _this.resetDefaultMetaTags();
  };

  this.resetDefaultMetaTags = function () {
    if (_this.config.meta) {
      _this.defaultMetaTags = (0, _meta.getDefaultMetaTags)(_this.config.meta);
      (0, _meta.setMetaTags)(_this.defaultMetaTags);
    } else {
      _this.defaultMetaTags = (0, _meta.getDefaultMetaTags)();
    }
  };

  this.setDefaultMetaTags = function () {
    (0, _meta.setMetaTags)(_this.defaultMetaTags);
  };

  this.goToTop = function () {
    if ((0, _scroll.getScrollTop)() === 0) return;
    _this.forcedHash = true;

    (0, _scroll.scrollTo)({
      top: 0,
      behavior: _this.config.scrollBehaviour
    });
  };

  this.addAnchor = function (_ref) {
    var element = _ref.element,
        name = _ref.name,
        hash = _ref.hash,
        id = _ref.id,
        meta = _ref.meta,
        exact = _ref.exact;

    // if this is the first anchor, set up listeners
    if (Object.keys(_this.anchors).length === 0) {
      _this.addListeners();
    }

    var urlName = name || '';
    var urlHash = hash ? '#' + hash : '';

    // check if this anchor is the current one
    if (window.location.href.endsWith('' + urlName + urlHash)) {
      _this.forceHashUpdate();
    }
    if (window.location.pathname.endsWith('/' + urlName)) {
      _this.basePathName = _this.basePathName.replace('/' + urlName, '');
      if (_this.basePathName === '') _this.basePathName = '/';
    }

    _this.anchors[id] = {
      id: id,
      component: element,
      name: name,
      hash: hash,
      meta: meta,
      exact: exact
    };

    _this.basePath = _this.getBasePath(_this.anchors);

    _this.normalizeMetaTags();
  };

  this.normalizeMetaTags = function () {
    Object.keys(_this.anchors).forEach(function (anchorId) {
      var anchor = _this.anchors[anchorId];
      if (anchor.hash && !anchor.meta) {

        if (anchor.exact || !anchor.name) {
          anchor.meta = _this.defaultMetaTags;
        } else if (anchor.name) {
          var parentAnchor = (0, _func.getAnchoreByName)(_this.anchors, anchor.name);

          if (parentAnchor) {
            anchor.meta = parentAnchor.meta;
          }
        }
      }
    });
  };

  this.removeAnchor = function (id) {
    delete _this.anchors[id];
    // if this is the last anchor, remove listeners
    if (Object.keys(_this.anchors).length === 0) {
      _this.removeListeners();
    }
  };

  this.onSectionChange = function (newAnchor, oldAnchor) {
    var onSectionEnter = _this.config.onSectionEnter;

    var getPath = function getPath(anchor) {
      return anchor.name ? anchor.exact ? '/' + anchor.name : (_this.basePathName !== '/' ? _this.basePathName : '') + '/' + anchor.name : _this.basePathName;
    };

    if (typeof onSectionEnter === 'function') {
      var nextState = newAnchor ? _extends({}, _this.anchors[newAnchor], { id: newAnchor }) : {};
      nextState.path = getPath(nextState);

      var prevState = oldAnchor ? _extends({}, _this.anchors[oldAnchor], { id: oldAnchor }) : {};
      prevState.path = getPath(prevState);

      onSectionEnter(nextState, prevState);
    }
  };

  this.handleScroll = function () {
    var _config = _this.config,
        offset = _config.offset,
        keepLastAnchorHash = _config.keepLastAnchorHash,
        affectHistory = _config.affectHistory;

    var nextAnchor = (0, _scroll.getBestAnchorGivenScrollLocation)(_this.anchors, -offset);
    var prevAnchor = (0, _hash.getHash)({ manager: _this });

    if (nextAnchor && prevAnchor !== nextAnchor) {
      _this.forcedHash = true;

      (0, _hash.updateHash)({
        anchor: _this.anchors[nextAnchor],
        affectHistory: affectHistory,
        manager: _this
      });

      _this.onSectionChange(nextAnchor, prevAnchor);
    } else if (!nextAnchor && !keepLastAnchorHash) {
      (0, _hash.removeHash)({ manager: _this });
      if (_this.anchors[prevAnchor]) {
        _this.onSectionChange(null, prevAnchor);
      }
    }
  };

  this.handleHashChange = function (e) {
    _this.basePath = _this.getBasePath(_this.anchors);

    if (_this.forcedHash) {
      _this.forcedHash = false;
    } else {
      var hash = (0, _hash.getHash)({ manager: _this });
      var runScrollingToSection = function runScrollingToSection() {
        var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        return _this.goToSection(hash, delay);
      };

      if (_this.config.scrollOnImagesLoad && !_this.imagesAreLoaded) {
        window.addEventListener(EVENT_IMAGES_LOADED, runScrollingToSection, false);
      } else {
        runScrollingToSection(_this.config.scrollDelay);
      }
    }
  };

  this.goToSection = function (id) {
    var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var element = (_this.anchors[id] ? _this.anchors[id].component : null) || document.getElementById(id);
    var offset = _this.config.offset;


    if (element) {
      setTimeout(function () {
        var marginTop = ~~(element.currentStyle || window.getComputedStyle(element).marginTop.replace(/\D+/g, ''));
        var elementPosition = element.getBoundingClientRect().top;
        var offsetPosition = elementPosition - offset;

        (0, _scroll.scrollTo)({
          top: offsetPosition,
          behavior: _this.config.scrollBehaviour
        });
      }, delay);
    }
  };

  this.anchors = {};
  this.forcedHash = false;
  this.config = defaultConfig;

  this.scrollHandler = (0, _func.debounce)(this.handleScroll, ~~this.config.debounce);
  this.forceHashUpdate = (0, _func.debounce)(this.handleHashChange, 1);

  this.basePath = this.getBasePath();
  this.basePathName = window.location.pathname;
  this.imagesAreLoaded = false;

  this.resetDefaultMetaTags();

  setTimeout(function () {
    var eventDispatched = false;
    var fireEvent = function fireEvent() {
      if (!eventDispatched) {
        var event = new Event(EVENT_IMAGES_LOADED);
        window.dispatchEvent(event);
      }
      eventDispatched = true;
    };

    if (_this.config.scrollOnImagesLoad) {

      if (_this.config.scrollOnImagesLoad > 1) {
        setTimeout(fireEvent, parseInt(_this.config.scrollOnImagesLoad, 10));
      }

      var imgs = document.images;
      var len = imgs.length;
      var counter = 0;

      var incrementCounter = function incrementCounter() {
        counter++;

        if (counter === len) {
          _this.imagesAreLoaded = true;
          fireEvent();
        }
      };

      [].forEach.call(imgs, function (img) {
        if (img.complete) {
          incrementCounter();
        } else {
          img.addEventListener('load', incrementCounter, false);
        }
      });
    }
  });

  if (window.history && window.history.pushState) {
    window.addEventListener('popstate', function () {
      if (_this.config.reloadOnGoingBack) {
        window.location.reload();
      }
    });
  }
};

exports.default = new Manager();