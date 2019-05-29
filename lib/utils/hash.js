'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeHash = exports.updateHash = exports.getHash = undefined;

var _func = require('./func');

var _meta = require('./meta');

var basePath = typeof window !== 'undefined' ? '' + window.location.origin + window.location.pathname : '';

var getCurrentHash = function getCurrentHash() {
  if (typeof window !== 'undefined') decodeURI(window.location.hash.slice(1));
};

var getHash = exports.getHash = function getHash(_ref) {
  var manager = _ref.manager;
  var basePath = manager.basePath;

  var name = typeof window !== 'undefined' ? window.location.pathname.replace(basePath.replace(window.location.origin, ''), '').slice(1) : '';
  var hash = getCurrentHash();
  return (0, _func.createId)({ name: name, hash: hash });
};

var updateHash = exports.updateHash = function updateHash(_ref2) {
  var anchor = _ref2.anchor,
      affectHistory = _ref2.affectHistory,
      manager = _ref2.manager;
  var hash = anchor.hash,
      name = anchor.name,
      meta = anchor.meta,
      exact = anchor.exact;
  var basePath = manager.basePath;

  var method = affectHistory ? 'pushState' : 'replaceState';
  var newPath = typeof window !== 'undefined' ? '' + (name ? (exact ? window.location.origin : basePath) + '/' + name : basePath) + (hash ? '#' + hash : '') : '';

  if (typeof window !== 'undefined') window.history[method](undefined, undefined, newPath);

  if (meta) {
    (0, _meta.setMetaTags)(meta);
  } else {
    manager.setDefaultMetaTags();
  }
};

// remove hash in url without affecting history or forcing reload
var removeHash = exports.removeHash = function removeHash(_ref3) {
  var manager = _ref3.manager;

  if (typeof window !== 'undefined') window.history.replaceState(undefined, manager.defaultMetaTags.title, manager ? manager.basePath : basePath);

  manager.setDefaultMetaTags();
};