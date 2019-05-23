/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = Studio;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = Studio.libraries['react'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var PDF_UTILS_TAB_TITLE = exports.PDF_UTILS_TAB_TITLE = 'PDF_UTILS_TAB_TITLE';
var PDF_UTILS_TAB_EDITOR = exports.PDF_UTILS_TAB_EDITOR = 'PDF_UTILS_TAB_EDITOR';

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jsreportStudio = __webpack_require__(0);

var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);

var _TemplatePdfUtilsProperties = __webpack_require__(4);

var _TemplatePdfUtilsProperties2 = _interopRequireDefault(_TemplatePdfUtilsProperties);

var _PdfUtilsTitle = __webpack_require__(5);

var _PdfUtilsTitle2 = _interopRequireDefault(_PdfUtilsTitle);

var _PdfUtilsEditor = __webpack_require__(6);

var _PdfUtilsEditor2 = _interopRequireDefault(_PdfUtilsEditor);

var _constants = __webpack_require__(2);

var Constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jsreportStudio2.default.addPropertiesComponent(_TemplatePdfUtilsProperties2.default.title, _TemplatePdfUtilsProperties2.default, function (entity) {
  return entity.__entitySet === 'templates' && entity.recipe.includes('pdf');
});

_jsreportStudio2.default.addEditorComponent(Constants.PDF_UTILS_TAB_EDITOR, _PdfUtilsEditor2.default);
_jsreportStudio2.default.addTabTitleComponent(Constants.PDF_UTILS_TAB_TITLE, _PdfUtilsTitle2.default);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _jsreportStudio = __webpack_require__(0);

var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);

var _constants = __webpack_require__(2);

var Constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Properties = function (_Component) {
  _inherits(Properties, _Component);

  function Properties() {
    _classCallCheck(this, Properties);

    return _possibleConstructorReturn(this, (Properties.__proto__ || Object.getPrototypeOf(Properties)).apply(this, arguments));
  }

  _createClass(Properties, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.removeInvalidTemplateReferences();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.removeInvalidTemplateReferences();
    }
  }, {
    key: 'openEditor',
    value: function openEditor() {
      _jsreportStudio2.default.openTab({
        key: this.props.entity._id + '_pdfUtils',
        _id: this.props.entity._id,
        editorComponentKey: Constants.PDF_UTILS_TAB_EDITOR,
        titleComponentKey: Constants.PDF_UTILS_TAB_TITLE
      });
    }
  }, {
    key: 'removeInvalidTemplateReferences',
    value: function removeInvalidTemplateReferences() {
      var _props = this.props,
          entity = _props.entity,
          entities = _props.entities,
          onChange = _props.onChange;


      if (!entity.pdfOperations) {
        return;
      }

      var hasTemplateReferences = false;
      var updatedOperations = void 0;

      updatedOperations = entity.pdfOperations;
      hasTemplateReferences = entity.pdfOperations.filter(function (o) {
        return o.templateShortid != null;
      }).length > 0;

      if (hasTemplateReferences) {
        updatedOperations = entity.pdfOperations.filter(function (o) {
          // tolerate operations recently added
          if (o.templateShortid == null) {
            return true;
          }

          return Object.keys(entities).filter(function (k) {
            return entities[k].__entitySet === 'templates' && entities[k].shortid === o.templateShortid;
          }).length;
        });
      }

      if (hasTemplateReferences && updatedOperations.length !== entity.pdfOperations.length) {
        onChange({ _id: entity._id, pdfOperations: updatedOperations });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'properties-section' },
        _react2.default.createElement(
          'div',
          { className: 'form-group' },
          _react2.default.createElement(
            'button',
            { onClick: function onClick() {
                return _this2.openEditor();
              } },
            'Configure'
          )
        )
      );
    }
  }], [{
    key: 'title',
    value: function title(entity, entities) {
      if (!entity.pdfOperations || entity.pdfOperations.length === 0) {
        return 'pdf utils';
      }

      var getTemplate = function getTemplate(shortid) {
        return _jsreportStudio2.default.getEntityByShortid(shortid, false) || { name: '' };
      };
      return 'pdf utils: ' + entity.pdfOperations.map(function (o) {
        return getTemplate(o.templateShortid).name;
      }).join(', ');
    }
  }]);

  return Properties;
}(_react.Component);

exports.default = Properties;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (props) {
  return _react2.default.createElement(
    'span',
    null,
    props.entity.name + ' pdf utils ' + (props.entity.__isDirty ? '*' : '')
  );
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _jsreportStudio = __webpack_require__(0);

var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);

var _style = __webpack_require__(7);

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EntityRefSelect = _jsreportStudio2.default.EntityRefSelect;

var PdfUtilsEditor = function (_Component) {
  _inherits(PdfUtilsEditor, _Component);

  function PdfUtilsEditor() {
    _classCallCheck(this, PdfUtilsEditor);

    return _possibleConstructorReturn(this, (PdfUtilsEditor.__proto__ || Object.getPrototypeOf(PdfUtilsEditor)).apply(this, arguments));
  }

  _createClass(PdfUtilsEditor, [{
    key: 'addOperation',
    value: function addOperation(entity) {
      _jsreportStudio2.default.updateEntity(Object.assign({}, entity, { pdfOperations: [].concat(_toConsumableArray(entity.pdfOperations || []), [{ type: 'merge' }]) }));
    }
  }, {
    key: 'updateOperation',
    value: function updateOperation(entity, index, update) {
      _jsreportStudio2.default.updateEntity(Object.assign({}, entity, { pdfOperations: entity.pdfOperations.map(function (o, i) {
          return i === index ? Object.assign({}, o, update) : o;
        }) }));
    }
  }, {
    key: 'removeOperation',
    value: function removeOperation(entity, index) {
      _jsreportStudio2.default.updateEntity(Object.assign({}, entity, { pdfOperations: entity.pdfOperations.filter(function (a, i) {
          return i !== index;
        }) }));
    }
  }, {
    key: 'moveDown',
    value: function moveDown(entity, index) {
      var pdfOperations = [].concat(_toConsumableArray(entity.pdfOperations));
      var tmp = pdfOperations[index + 1];
      pdfOperations[index + 1] = pdfOperations[index];
      pdfOperations[index] = tmp;
      _jsreportStudio2.default.updateEntity(Object.assign({}, entity, { pdfOperations: pdfOperations }));
    }
  }, {
    key: 'moveUp',
    value: function moveUp(entity, index) {
      var pdfOperations = [].concat(_toConsumableArray(entity.pdfOperations));
      var tmp = pdfOperations[index - 1];
      pdfOperations[index - 1] = pdfOperations[index];
      pdfOperations[index] = tmp;
      _jsreportStudio2.default.updateEntity(Object.assign({}, entity, { pdfOperations: pdfOperations }));
    }
  }, {
    key: 'renderOperation',
    value: function renderOperation(entity, operation, index) {
      var _this2 = this;

      return _react2.default.createElement(
        'tr',
        { key: index },
        _react2.default.createElement(
          'td',
          { style: { minWidth: '170px' } },
          _react2.default.createElement(EntityRefSelect, {
            headingLabel: 'Select template',
            filter: function filter(references) {
              var templates = references.templates.filter(function (e) {
                return e.shortid !== entity.shortid && e.recipe.includes('pdf');
              });
              return { templates: templates };
            },
            value: operation.templateShortid ? operation.templateShortid : null,
            onChange: function onChange(selected) {
              return _this2.updateOperation(entity, index, { templateShortid: selected != null && selected.length > 0 ? selected[0].shortid : null });
            }
          })
        ),
        _react2.default.createElement(
          'td',
          null,
          _react2.default.createElement(
            'select',
            {
              value: operation.type,
              onChange: function onChange(v) {
                return _this2.updateOperation(entity, index, { type: v.target.value });
              } },
            '>',
            _react2.default.createElement(
              'option',
              { value: 'merge' },
              'merge'
            ),
            _react2.default.createElement(
              'option',
              { value: 'append' },
              'append'
            ),
            _react2.default.createElement(
              'option',
              { value: 'prepend' },
              'prepend'
            )
          )
        ),
        _react2.default.createElement(
          'td',
          null,
          _react2.default.createElement('input', { type: 'checkbox', disabled: operation.type !== 'merge', checked: operation.mergeToFront === true, onChange: function onChange(v) {
              return _this2.updateOperation(entity, index, { mergeToFront: v.target.checked });
            } })
        ),
        _react2.default.createElement(
          'td',
          null,
          _react2.default.createElement('input', { type: 'checkbox', disabled: operation.type !== 'merge' || operation.mergeWholeDocument, checked: operation.renderForEveryPage === true, onChange: function onChange(v) {
              return _this2.updateOperation(entity, index, { renderForEveryPage: v.target.checked, mergeWholeDocument: false });
            } })
        ),
        _react2.default.createElement(
          'td',
          null,
          _react2.default.createElement('input', { type: 'checkbox', disabled: operation.type !== 'merge' || operation.renderForEveryPage, checked: operation.mergeWholeDocument === true, onChange: function onChange(v) {
              return _this2.updateOperation(entity, index, { mergeWholeDocument: v.target.checked, renderForEveryPage: false });
            } })
        ),
        _react2.default.createElement(
          'td',
          null,
          _react2.default.createElement('input', { type: 'checkbox', checked: operation.enabled !== false, onChange: function onChange(v) {
              return _this2.updateOperation(entity, index, { enabled: v.target.checked });
            } })
        ),
        _react2.default.createElement(
          'td',
          null,
          _react2.default.createElement(
            'button',
            { className: 'button', style: { backgroundColor: '#c6c6c6' }, onClick: function onClick() {
                return _this2.removeOperation(entity, index);
              } },
            _react2.default.createElement('i', { className: 'fa fa-times' })
          )
        ),
        _react2.default.createElement(
          'td',
          null,
          entity.pdfOperations[index - 1] ? _react2.default.createElement(
            'button',
            { className: 'button', style: { backgroundColor: '#c6c6c6' }, onClick: function onClick() {
                return _this2.moveUp(entity, index);
              } },
            _react2.default.createElement('i', { className: 'fa fa-arrow-up' })
          ) : ''
        ),
        _react2.default.createElement(
          'td',
          null,
          entity.pdfOperations[index + 1] ? _react2.default.createElement(
            'button',
            { className: 'button', style: { backgroundColor: '#c6c6c6' }, onClick: function onClick() {
                return _this2.moveDown(entity, index);
              } },
            _react2.default.createElement('i', { className: 'fa fa-arrow-down' })
          ) : ''
        )
      );
    }
  }, {
    key: 'renderOperations',
    value: function renderOperations(entity) {
      var _this3 = this;

      return _react2.default.createElement(
        'table',
        { className: _style2.default.operationTable },
        _react2.default.createElement(
          'thead',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement(
              'th',
              null,
              'Template'
            ),
            _react2.default.createElement(
              'th',
              null,
              'Operation'
            ),
            _react2.default.createElement(
              'th',
              null,
              'Merge to front'
            ),
            _react2.default.createElement(
              'th',
              null,
              'Render for every page'
            ),
            _react2.default.createElement(
              'th',
              null,
              'Merge whole document'
            ),
            _react2.default.createElement(
              'th',
              null,
              'Enabled'
            ),
            _react2.default.createElement('th', null),
            _react2.default.createElement('th', null),
            _react2.default.createElement('th', null)
          )
        ),
        _react2.default.createElement(
          'tbody',
          null,
          (entity.pdfOperations || []).map(function (o, i) {
            return _this3.renderOperation(entity, o, i);
          })
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var entity = this.props.entity;


      return _react2.default.createElement(
        'div',
        { className: 'block custom-editor', style: { overflowX: 'auto' } },
        _react2.default.createElement(
          'h1',
          null,
          _react2.default.createElement('i', { className: 'fa fa-file-pdf-o' }),
          ' pdf operations'
        ),
        _react2.default.createElement(
          'p',
          { style: { marginTop: '1rem' } },
          'Use merge/append operations to add dynamic headers or concatenate multiple pdf reports into one. See more docs and examples ',
          _react2.default.createElement(
            'a',
            { href: 'https://jsreport.net/learn/pdf-utils' },
            'here'
          ),
          '.'
        ),
        _react2.default.createElement(
          'div',
          { style: { marginTop: '1rem' } },
          this.renderOperations(entity)
        ),
        _react2.default.createElement(
          'div',
          { style: { marginTop: '1rem' } },
          _react2.default.createElement(
            'button',
            { className: 'button confirmation', onClick: function onClick() {
                return _this4.addOperation(entity);
              } },
            'Add operation'
          )
        )
      );
    }
  }]);

  return PdfUtilsEditor;
}(_react.Component);

exports.default = PdfUtilsEditor;


PdfUtilsEditor.propTypes = {
  entity: _react2.default.PropTypes.object.isRequired,
  tab: _react2.default.PropTypes.object.isRequired,
  onUpdate: _react2.default.PropTypes.func.isRequired
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(8);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(10)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(9)(true);
// Module
exports.push([module.i, ".operationTable___3ENuL {\n  border-collapse: collapse;\n  border: none;\n  overflow: scroll;\n}\n\n.operationTable___3ENuL th {\n  padding: 0.5rem;\n}\n\n.operationTable___3ENuL td:nth-child(3),\n.operationTable___3ENuL td:nth-child(4),\n.operationTable___3ENuL td:nth-child(5),\n.operationTable___3ENuL th:nth-child(3),\n.operationTable___3ENuL th:nth-child(4),\n.operationTable___3ENuL th:nth-child(5) {\n  text-align: center;\n  padding-left: 1rem;\n  background-color: #F6F6F6;\n}\n", "",{"version":3,"sources":["style.scss"],"names":[],"mappings":"AAAA;EACE,yBAAyB;EACzB,YAAY;EACZ,gBAAgB;AAClB;;AAEA;EACE,eAAe;AACjB;;AAEA;;;;;;EAME,kBAAkB;EAClB,kBAAkB;EAClB,yBAAyB;AAC3B","file":"style.scss","sourcesContent":[".operationTable {\n  border-collapse: collapse;\n  border: none;\n  overflow: scroll;\n}\n\n.operationTable th {\n  padding: 0.5rem;\n}\n\n.operationTable td:nth-child(3),\n.operationTable td:nth-child(4),\n.operationTable td:nth-child(5),\n.operationTable th:nth-child(3),\n.operationTable th:nth-child(4),\n.operationTable th:nth-child(5) {\n  text-align: center;\n  padding-left: 1rem;\n  background-color: #F6F6F6;\n}\n"]}]);

// Exports
exports.locals = {
	"operationTable": "operationTable___3ENuL"
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return '@media ' + item[2] + '{' + content + '}';
      } else {
        return content;
      }
    }).join('');
  }; // import a list of modules into the list


  list.i = function (modules, mediaQuery) {
    if (typeof modules === 'string') {
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    for (var i = 0; i < this.length; i++) {
      var id = this[i][0];

      if (id != null) {
        alreadyImportedModules[id] = true;
      }
    }

    for (i = 0; i < modules.length; i++) {
      var item = modules[i]; // skip already imported module
      // this implementation is not 100% perfect for weird media query combinations
      // when a module is imported multiple times with different media queries.
      // I hope this will never occur (Hey this way we have smaller bundles)

      if (item[0] == null || !alreadyImportedModules[item[0]]) {
        if (mediaQuery && !item[2]) {
          item[2] = mediaQuery;
        } else if (mediaQuery) {
          item[2] = '(' + item[2] + ') and (' + mediaQuery + ')';
        }

        list.push(item);
      }
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || '';
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;
  return '/*# ' + data + ' */';
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target, parent) {
  if (parent){
    return parent.querySelector(target);
  }
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target, parent) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target, parent);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(11);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertAt.before, target);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	if(options.attrs.nonce === undefined) {
		var nonce = getNonce();
		if (nonce) {
			options.attrs.nonce = nonce;
		}
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function getNonce() {
	if (false) {}

	return __webpack_require__.nc;
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = typeof options.transform === 'function'
		 ? options.transform(obj.css) 
		 : options.transform.default(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 11 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);