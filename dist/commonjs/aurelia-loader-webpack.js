'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaMetadata = require('aurelia-metadata');

var _aureliaLoader = require('aurelia-loader');

var _aureliaPal = require('aurelia-pal');

/**
* An implementation of the TemplateLoader interface implemented with text-based loading.
*/

var TextTemplateLoader = (function () {
  function TextTemplateLoader() {
    _classCallCheck(this, TextTemplateLoader);
  }

  _createClass(TextTemplateLoader, [{
    key: 'loadTemplate',

    /**
    * Loads a template.
    * @param loader The loader that is requesting the template load.
    * @param entry The TemplateRegistryEntry to load and populate with a template.
    * @return A promise which resolves when the TemplateRegistryEntry is loaded with a template.
    */
    value: function loadTemplate(loader, entry) {
      return loader.loadText(entry.address).then(function (text) {
        entry.template = _aureliaPal.DOM.createTemplateFromMarkup(text);
      });
    }
  }]);

  return TextTemplateLoader;
})();

exports.TextTemplateLoader = TextTemplateLoader;

function ensureOriginOnExports(executed, name) {
  var target = executed;
  var key = undefined;
  var exportedValue = undefined;

  if (target.__useDefault) {
    target = target['default'];
  }

  _aureliaMetadata.Origin.set(target, new _aureliaMetadata.Origin(name, 'default'));

  for (key in target) {
    exportedValue = target[key];

    if (typeof exportedValue === 'function') {
      _aureliaMetadata.Origin.set(exportedValue, new _aureliaMetadata.Origin(name, key));
    }
  }

  return executed;
}

/**
* A default implementation of the Loader abstraction which works with webpack (extended common-js style).
*/

var WebpackLoader = (function (_Loader) {
  _inherits(WebpackLoader, _Loader);

  function WebpackLoader() {
    _classCallCheck(this, WebpackLoader);

    _get(Object.getPrototypeOf(WebpackLoader.prototype), 'constructor', this).call(this);

    this.moduleRegistry = {};
    this.loaderPlugins = {};
    this.useTemplateLoader(new TextTemplateLoader());

    var that = this;

    this.addPlugin('template-registry-entry', {
      'fetch': function fetch(address) {
        var entry = that.getOrCreateTemplateRegistryEntry(address);
        return entry.templateIsLoaded ? entry : that.templateLoader.loadTemplate(that, entry).then(function (x) {
          return entry;
        });
      }
    });
  }

  _createClass(WebpackLoader, [{
    key: '_import',
    value: function _import(moduleId) {
      var _this = this;

      var moduleIdParts = moduleId.split('!');
      var path = moduleIdParts.splice(moduleIdParts.length - 1, 1)[0];
      var loaderPlugin = moduleIdParts.length == 1 ? moduleIdParts[0] : null;

      return new Promise(function (resolve, reject) {
        try {
          if (loaderPlugin) {
            resolve(_this.loaderPlugins[loaderPlugin].fetch(path));
          } else {
            require.ensure([], function (require) {
              var result = require('aurelia-loader-context/' + path);
              if (typeof result === 'function') {
                // because of async loading when the bundle loader is active
                result(function (res) {
                  return resolve(res);
                });
              } else {
                resolve(result);
              }
            });
          }
        } catch (e) {
          reject(e);
        }
      });
    }

    /**
    * Maps a module id to a source.
    * @param id The module id.
    * @param source The source to map the module to.
    */
  }, {
    key: 'map',
    value: function map(id, source) {}

    /**
    * Normalizes a module id.
    * @param moduleId The module id to normalize.
    * @param relativeTo What the module id should be normalized relative to.
    * @return The normalized module id.
    */
  }, {
    key: 'normalizeSync',
    value: function normalizeSync(moduleId, relativeTo) {
      return moduleId;
    }

    /**
    * Normalizes a module id.
    * @param moduleId The module id to normalize.
    * @param relativeTo What the module id should be normalized relative to.
    * @return The normalized module id.
    */
  }, {
    key: 'normalize',
    value: function normalize(moduleId, relativeTo) {
      return Promise.resolve(moduleId);
    }

    /**
    * Instructs the loader to use a specific TemplateLoader instance for loading templates
    * @param templateLoader The instance of TemplateLoader to use for loading templates.
    */
  }, {
    key: 'useTemplateLoader',
    value: function useTemplateLoader(templateLoader) {
      this.templateLoader = templateLoader;
    }

    /**
    * Loads a collection of modules.
    * @param ids The set of module ids to load.
    * @return A Promise for an array of loaded modules.
    */
  }, {
    key: 'loadAllModules',
    value: function loadAllModules(ids) {
      var loads = [];

      for (var i = 0, ii = ids.length; i < ii; ++i) {
        loads.push(this.loadModule(ids[i]));
      }

      return Promise.all(loads);
    }

    /**
    * Loads a module.
    * @param id The module id to normalize.
    * @return A Promise for the loaded module.
    */
  }, {
    key: 'loadModule',
    value: function loadModule(id) {
      var _this2 = this;

      var existing = this.moduleRegistry[id];
      if (existing) {
        return Promise.resolve(existing);
      }

      return new Promise(function (resolve, reject) {
        try {
          _this2._import(id).then(function (m) {
            _this2.moduleRegistry[id] = m;
            resolve(ensureOriginOnExports(m, id));
          });
        } catch (e) {
          reject(e);
        }
      });
    }
  }, {
    key: 'loadTemplate',

    /**
    * Loads a template.
    * @param url The url of the template to load.
    * @return A Promise for a TemplateRegistryEntry containing the template.
    */
    value: function loadTemplate(url) {
      return this._import(this.applyPluginToUrl(url, 'template-registry-entry'));
    }

    /**
    * Loads a text-based resource.
    * @param url The url of the text file to load.
    * @return A Promise for text content.
    */
  }, {
    key: 'loadText',
    value: function loadText(url) {
      return this._import(url);
    }

    /**
    * Alters a module id so that it includes a plugin loader.
    * @param url The url of the module to load.
    * @param pluginName The plugin to apply to the module id.
    * @return The plugin-based module id.
    */
  }, {
    key: 'applyPluginToUrl',
    value: function applyPluginToUrl(url, pluginName) {
      return pluginName + '!' + url;
    }
  }, {
    key: 'addPlugin',

    /**
    * Registers a plugin with the loader.
    * @param pluginName The name of the plugin.
    * @param implementation The plugin implementation.
    */
    value: function addPlugin(pluginName, implementation) {
      this.loaderPlugins[pluginName] = implementation;
    }
  }]);

  return WebpackLoader;
})(_aureliaLoader.Loader);

exports.WebpackLoader = WebpackLoader;

_aureliaPal.PLATFORM.Loader = WebpackLoader;

_aureliaPal.PLATFORM.eachModule = function (callback) {};