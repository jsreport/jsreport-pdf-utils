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

module.exports = Studio.libraries['react'];

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = Studio;

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


var _jsreportStudio = __webpack_require__(1);

var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);

var _AssetProperties = __webpack_require__(4);

var _AssetProperties2 = _interopRequireDefault(_AssetProperties);

var _TemplatePdfUtilsProperties = __webpack_require__(5);

var _TemplatePdfUtilsProperties2 = _interopRequireDefault(_TemplatePdfUtilsProperties);

var _PdfUtilsTitle = __webpack_require__(6);

var _PdfUtilsTitle2 = _interopRequireDefault(_PdfUtilsTitle);

var _PdfUtilsEditor = __webpack_require__(7);

var _PdfUtilsEditor2 = _interopRequireDefault(_PdfUtilsEditor);

var _constants = __webpack_require__(2);

var Constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jsreportStudio2.default.addPropertiesComponent(_TemplatePdfUtilsProperties2.default.title, _TemplatePdfUtilsProperties2.default, function (entity) {
  return entity.__entitySet === 'templates' && entity.recipe.includes('pdf');
});

_jsreportStudio2.default.addPropertiesComponent(_AssetProperties2.default.title, _AssetProperties2.default, function (entity) {
  return entity.__entitySet === 'assets' && entity.name && entity.name.includes('.p12');
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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

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
    key: 'render',
    value: function render() {
      var _props = this.props,
          entity = _props.entity,
          onChange = _props.onChange;


      var pdfSign = entity.pdfSign || {};

      var changePdfSign = function changePdfSign(change) {
        return onChange(_extends({}, entity, { pdfSign: _extends({}, entity.pdfSign, change) }));
      };

      var password = pdfSign.passwordRaw;

      if (password == null || password === '') {
        password = pdfSign.passwordFilled === true ? '******' : '';
      }

      return _react2.default.createElement(
        'div',
        { className: 'properties-section' },
        _react2.default.createElement(
          'div',
          { className: 'form-group' },
          _react2.default.createElement(
            'label',
            null,
            'password'
          ),
          _react2.default.createElement('input', {
            type: 'password', value: password,
            onChange: function onChange(v) {
              return changePdfSign({ passwordRaw: v.target.value });
            } })
        )
      );
    }
  }], [{
    key: 'title',
    value: function title(entity, entities) {
      if (!entity.pdfSign) {
        return 'pdf sign';
      }

      return entity.pdfSign.passwordFilled ? 'pdf sign password filled' : 'pdf sign';
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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _jsreportStudio = __webpack_require__(1);

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
      this.removeInvalidAssetReferences();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.removeInvalidTemplateReferences();
      this.removeInvalidAssetReferences();
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
    key: 'removeInvalidAssetReferences',
    value: function removeInvalidAssetReferences() {
      var _props2 = this.props,
          entity = _props2.entity,
          entities = _props2.entities,
          onChange = _props2.onChange;


      if (!entity.pdfSign) {
        return;
      }

      var updatedAssetItems = Object.keys(entities).filter(function (k) {
        return entities[k].__entitySet === 'assets' && entities[k].shortid === entity.pdfSign.certificateAssetShortid;
      });

      if (updatedAssetItems.length === 0 && entity.pdfSign.certificateAssetShortid) {
        onChange({
          _id: entity._id,
          pdfSign: _extends({}, entity.pdfSign, {
            certificateAssetShortid: null
          })
        });
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
      if ((!entity.pdfOperations || entity.pdfOperations.length === 0) && entity.pdfMeta == null && entity.pdfPassword == null && (entity.pdfSign == null || entity.pdfSign.certificateAssetShortid == null)) {
        return 'pdf utils';
      }

      var title = 'pdf utils:';

      var getTemplate = function getTemplate(shortid) {
        return _jsreportStudio2.default.getEntityByShortid(shortid, false) || { name: '' };
      };

      if (entity.pdfOperations && entity.pdfOperations.length > 0) {
        title = title + ' ' + entity.pdfOperations.map(function (o) {
          return getTemplate(o.templateShortid).name;
        }).join(', ');
      }

      var extra = [];

      if (entity.pdfMeta != null) {
        extra.push('meta');
      }

      if (entity.pdfPassword != null && (entity.pdfPassword.password != null || entity.pdfPassword.ownerPassword != null)) {
        extra.push('password');
      }

      if (entity.pdfSign != null && entity.pdfSign.certificateAssetShortid != null) {
        extra.push('sign');
      }

      if (extra.length > 0) {
        title = title + ' (' + extra.join(', ') + ')';
      }

      return title;
    }
  }, {
    key: 'selectAssets',
    value: function selectAssets(entities) {
      return Object.keys(entities).filter(function (k) {
        return entities[k].__entitySet === 'assets';
      }).map(function (k) {
        return entities[k];
      });
    }
  }]);

  return Properties;
}(_react.Component);

exports.default = Properties;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _jsreportStudio = __webpack_require__(1);

var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);

var _style = __webpack_require__(8);

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EntityRefSelect = _jsreportStudio2.default.EntityRefSelect;

var PdfUtilsEditor = function (_Component) {
  _inherits(PdfUtilsEditor, _Component);

  function PdfUtilsEditor(props) {
    _classCallCheck(this, PdfUtilsEditor);

    var _this = _possibleConstructorReturn(this, (PdfUtilsEditor.__proto__ || Object.getPrototypeOf(PdfUtilsEditor)).call(this, props));

    _this.state = {
      activeTab: 'operations'
    };
    return _this;
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
    key: 'updateMeta',
    value: function updateMeta(entity, update) {
      var pdfMeta = entity.pdfMeta || {};

      pdfMeta = _extends({}, pdfMeta, update);

      Object.keys(pdfMeta).forEach(function (metaKey) {
        if (pdfMeta[metaKey] === '') {
          delete pdfMeta[metaKey];
        }
      });

      var keys = Object.keys(pdfMeta);

      if (keys.length === 0 || keys.every(function (k) {
        return pdfMeta[k] == null;
      })) {
        var newEntity = Object.assign({}, entity);
        newEntity.pdfMeta = null;
        return _jsreportStudio2.default.updateEntity(newEntity);
      }

      _jsreportStudio2.default.updateEntity(Object.assign({}, entity, { pdfMeta: pdfMeta }));
    }
  }, {
    key: 'updatePassword',
    value: function updatePassword(entity, update) {
      var pdfPassword = entity.pdfPassword || {};

      pdfPassword = _extends({}, pdfPassword, update);

      Object.keys(pdfPassword).forEach(function (metaKey) {
        if (pdfPassword[metaKey] === '') {
          delete pdfPassword[metaKey];
        }
      });

      var keys = Object.keys(pdfPassword);

      if (keys.length === 0 || keys.every(function (k) {
        return pdfPassword[k] == null || pdfPassword[k] === false;
      })) {
        var newEntity = Object.assign({}, entity);
        newEntity.pdfPassword = null;
        return _jsreportStudio2.default.updateEntity(newEntity);
      }

      _jsreportStudio2.default.updateEntity(Object.assign({}, entity, { pdfPassword: pdfPassword }));
    }
  }, {
    key: 'updateSign',
    value: function updateSign(entity, update) {
      var pdfSign = entity.pdfSign || {};

      pdfSign = _extends({}, pdfSign, update);

      Object.keys(pdfSign).forEach(function (metaKey) {
        if (pdfSign[metaKey] === '') {
          delete pdfSign[metaKey];
        }
      });

      var keys = Object.keys(pdfSign);

      if (keys.length === 0 || keys.every(function (k) {
        return pdfSign[k] == null;
      })) {
        var newEntity = Object.assign({}, entity);
        newEntity.pdfSign = null;
        return _jsreportStudio2.default.updateEntity(newEntity);
      }

      _jsreportStudio2.default.updateEntity(Object.assign({}, entity, { pdfSign: pdfSign }));
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

      var activeTab = this.state.activeTab;
      var entity = this.props.entity;


      var pdfMeta = entity.pdfMeta || {};
      var pdfPassword = entity.pdfPassword || {};
      var pdfSign = entity.pdfSign || {};

      return _react2.default.createElement(
        'div',
        { className: 'block custom-editor', style: { overflowX: 'auto' } },
        _react2.default.createElement(
          'h1',
          null,
          _react2.default.createElement('i', { className: 'fa fa-file-pdf-o' }),
          ' pdf utils configuration'
        ),
        _react2.default.createElement(
          'div',
          { className: _style2.default.tabContainer },
          _react2.default.createElement(
            'ul',
            { className: _style2.default.tabTitles },
            _react2.default.createElement(
              'li',
              {
                className: _style2.default.tabTitle + ' ' + (activeTab === 'operations' ? _style2.default.active : ''),
                onClick: function onClick() {
                  return _this4.setState({ activeTab: 'operations' });
                }
              },
              'operations'
            ),
            _react2.default.createElement(
              'li',
              {
                className: _style2.default.tabTitle + ' ' + (activeTab === 'meta' ? _style2.default.active : ''),
                onClick: function onClick() {
                  return _this4.setState({ activeTab: 'meta' });
                }
              },
              'meta'
            ),
            _react2.default.createElement(
              'li',
              {
                className: _style2.default.tabTitle + ' ' + (activeTab === 'password' ? _style2.default.active : ''),
                onClick: function onClick() {
                  return _this4.setState({ activeTab: 'password' });
                }
              },
              'password'
            ),
            _react2.default.createElement(
              'li',
              {
                className: _style2.default.tabTitle + ' ' + (activeTab === 'sign' ? _style2.default.active : ''),
                onClick: function onClick() {
                  return _this4.setState({ activeTab: 'sign' });
                }
              },
              'sign'
            )
          ),
          _react2.default.createElement(
            'div',
            { className: _style2.default.tabPanel + ' ' + (activeTab === 'operations' ? _style2.default.active : '') },
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
          ),
          _react2.default.createElement(
            'div',
            { className: _style2.default.tabPanel + ' ' + (activeTab === 'meta' ? _style2.default.active : '') },
            _react2.default.createElement(
              'p',
              { style: { marginTop: '1rem' } },
              'Add metadata information to the final PDF.'
            ),
            _react2.default.createElement(
              'div',
              { style: { marginTop: '1rem', paddingBottom: '0.5rem' } },
              _react2.default.createElement(
                'div',
                { className: 'form-group' },
                _react2.default.createElement(
                  'label',
                  null,
                  'Title'
                ),
                _react2.default.createElement('input', { type: 'text', value: pdfMeta.title || '', onChange: function onChange(v) {
                    return _this4.updateMeta(entity, { title: v.target.value });
                  } })
              ),
              _react2.default.createElement(
                'div',
                { className: 'form-group' },
                _react2.default.createElement(
                  'label',
                  null,
                  'Author'
                ),
                _react2.default.createElement('input', { type: 'text', value: pdfMeta.author || '', onChange: function onChange(v) {
                    return _this4.updateMeta(entity, { author: v.target.value });
                  } })
              ),
              _react2.default.createElement(
                'div',
                { className: 'form-group' },
                _react2.default.createElement(
                  'label',
                  null,
                  'Subject'
                ),
                _react2.default.createElement('input', { type: 'text', value: pdfMeta.subject || '', onChange: function onChange(v) {
                    return _this4.updateMeta(entity, { subject: v.target.value });
                  } })
              ),
              _react2.default.createElement(
                'div',
                { className: 'form-group' },
                _react2.default.createElement(
                  'label',
                  null,
                  'Keywords'
                ),
                _react2.default.createElement('input', { type: 'text', value: pdfMeta.keywords || '', onChange: function onChange(v) {
                    return _this4.updateMeta(entity, { keywords: v.target.value });
                  } })
              ),
              _react2.default.createElement(
                'div',
                { className: 'form-group' },
                _react2.default.createElement(
                  'label',
                  null,
                  'Creator'
                ),
                _react2.default.createElement('input', { type: 'text', value: pdfMeta.creator || '', onChange: function onChange(v) {
                    return _this4.updateMeta(entity, { creator: v.target.value });
                  } })
              ),
              _react2.default.createElement(
                'div',
                { className: 'form-group' },
                _react2.default.createElement(
                  'label',
                  null,
                  'Producer'
                ),
                _react2.default.createElement('input', { type: 'text', value: pdfMeta.producer || '', onChange: function onChange(v) {
                    return _this4.updateMeta(entity, { producer: v.target.value });
                  } })
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: _style2.default.tabPanel + ' ' + (activeTab === 'password' ? _style2.default.active : '') },
            _react2.default.createElement(
              'p',
              { style: { marginTop: '1rem' } },
              'Add encryption and access privileges to the final PDF. You can specify either user password, owner password or both passwords. Behavior differs according to passwords you provides:',
              _react2.default.createElement(
                'ul',
                null,
                _react2.default.createElement(
                  'li',
                  null,
                  'When only user password is provided, users with user password are able to decrypt the file and have full access to the document.'
                ),
                _react2.default.createElement(
                  'li',
                  null,
                  'When only owner password is provided, users are able to decrypt and open the document without providing any password, but the access is limited to those operations explicitly permitted. Users with owner password have full access to the document.'
                ),
                _react2.default.createElement(
                  'li',
                  null,
                  'When both passwords are provided, users with user password are able to decrypt the file but only have limited access to the file according to permission settings. Users with owner password have full access to the document.'
                )
              )
            ),
            _react2.default.createElement(
              'div',
              { style: { marginTop: '1rem', paddingBottom: '0.5rem' } },
              _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                  'h2',
                  null,
                  'Encryption'
                ),
                _react2.default.createElement(
                  'div',
                  { key: 'password-field', className: 'form-group' },
                  _react2.default.createElement(
                    'label',
                    null,
                    'User Password'
                  ),
                  _react2.default.createElement('input', {
                    type: 'password',
                    autoComplete: 'off',
                    title: 'Users will be prompted to enter the password to decrypt the file when opening it',
                    placeholder: 'user password',
                    value: pdfPassword.password || '',
                    onChange: function onChange(v) {
                      return _this4.updatePassword(entity, { password: v.target.value });
                    }
                  })
                )
              ),
              _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                  'h2',
                  null,
                  'Access privileges'
                ),
                _react2.default.createElement(
                  'p',
                  null,
                  'To set access privileges for the PDF, you need to provide an owner password and permission settings.'
                ),
                _react2.default.createElement(
                  'div',
                  { key: 'owner-password-field', className: 'form-group' },
                  _react2.default.createElement(
                    'label',
                    null,
                    'Owner Password'
                  ),
                  _react2.default.createElement('input', {
                    type: 'password',
                    autoComplete: 'off',
                    title: 'Users with the owner password will always have full access to the PDF (no matter the permission settings)',
                    placeholder: 'owner password',
                    value: pdfPassword.ownerPassword || '',
                    onChange: function onChange(v) {
                      return _this4.updatePassword(entity, { ownerPassword: v.target.value });
                    }
                  })
                ),
                _react2.default.createElement(
                  'div',
                  { key: 'printing-permission-field', className: 'form-group' },
                  _react2.default.createElement(
                    'label',
                    null,
                    'Printing permission'
                  ),
                  _react2.default.createElement(
                    'select',
                    {
                      value: pdfPassword.printing || '-1',
                      title: 'Whether printing the file is allowed, and in which resolution the printing can be done',
                      onChange: function onChange(v) {
                        return _this4.updatePassword(entity, { printing: v.target.value === '-1' ? null : v.target.value });
                      }
                    },
                    _react2.default.createElement(
                      'option',
                      { key: '-1', value: '-1' },
                      'Not allowed'
                    ),
                    _react2.default.createElement(
                      'option',
                      { key: 'lowResolution', value: 'lowResolution', title: 'Allows the printing in degraded resolution' },
                      'Low Resolution'
                    ),
                    _react2.default.createElement(
                      'option',
                      { key: 'highResolution', value: 'highResolution', title: 'Allows the printing in the best resolution' },
                      'High Resolution'
                    )
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { key: 'modify-permission-field', className: 'form-group' },
                  _react2.default.createElement(
                    'label',
                    { title: 'Whether modifying the file is allowed' },
                    'Modify permission',
                    _react2.default.createElement('br', null),
                    _react2.default.createElement('input', {
                      type: 'checkbox', checked: pdfPassword.modifying === true,
                      onChange: function onChange(v) {
                        return _this4.updatePassword(entity, { modifying: v.target.checked });
                      }
                    })
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { key: 'copy-permission-field', className: 'form-group' },
                  _react2.default.createElement(
                    'label',
                    { title: 'Whether copying text or graphics from the file is allowed' },
                    'Copy permission',
                    _react2.default.createElement('br', null),
                    _react2.default.createElement('input', {
                      type: 'checkbox', checked: pdfPassword.copying === true,
                      onChange: function onChange(v) {
                        return _this4.updatePassword(entity, { copying: v.target.checked });
                      }
                    })
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { key: 'annotation-permission-field', className: 'form-group' },
                  _react2.default.createElement(
                    'label',
                    { title: 'Whether annotating, form filling the file is allowed' },
                    'Annotation permission',
                    _react2.default.createElement('br', null),
                    _react2.default.createElement('input', {
                      type: 'checkbox', checked: pdfPassword.annotating === true,
                      onChange: function onChange(v) {
                        return _this4.updatePassword(entity, { annotating: v.target.checked });
                      }
                    })
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { key: 'fillingForms-permission-field', className: 'form-group' },
                  _react2.default.createElement(
                    'label',
                    { title: 'Whether form filling and signing the file is allowed' },
                    'Filling Forms permission',
                    _react2.default.createElement('br', null),
                    _react2.default.createElement('input', {
                      type: 'checkbox', checked: pdfPassword.fillingForms === true,
                      onChange: function onChange(v) {
                        return _this4.updatePassword(entity, { fillingForms: v.target.checked });
                      }
                    })
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { key: 'contentAccessibility-permission-field', className: 'form-group' },
                  _react2.default.createElement(
                    'label',
                    { title: 'Whether copying text from the file for accessibility is allowed' },
                    'Content Accessibility permission',
                    _react2.default.createElement('br', null),
                    _react2.default.createElement('input', {
                      type: 'checkbox', checked: pdfPassword.contentAccessibility === true,
                      onChange: function onChange(v) {
                        return _this4.updatePassword(entity, { contentAccessibility: v.target.checked });
                      }
                    })
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { key: 'documentAssembly-permission-field', className: 'form-group' },
                  _react2.default.createElement(
                    'label',
                    { title: 'Whether assembling document is allowed' },
                    'Assembling Document permission',
                    _react2.default.createElement('br', null),
                    _react2.default.createElement('input', {
                      type: 'checkbox', checked: pdfPassword.documentAssembly === true,
                      onChange: function onChange(v) {
                        return _this4.updatePassword(entity, { documentAssembly: v.target.checked });
                      }
                    })
                  )
                )
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: _style2.default.tabPanel + ' ' + (activeTab === 'sign' ? _style2.default.active : '') },
            _react2.default.createElement(
              'p',
              { style: { marginTop: '1rem' } },
              'Add a digital signature to the final PDF.'
            ),
            _react2.default.createElement(
              'div',
              { style: { marginTop: '1rem', paddingBottom: '0.5rem' } },
              _react2.default.createElement(
                'div',
                { className: 'form-group' },
                _react2.default.createElement(
                  'label',
                  null,
                  'Select certificate (asset)'
                ),
                _react2.default.createElement(EntityRefSelect, {
                  headingLabel: 'Select certificate',
                  value: pdfSign.certificateAssetShortid || '',
                  onChange: function onChange(selected) {
                    return _this4.updateSign(entity, { certificateAssetShortid: selected.length > 0 ? selected[0].shortid : null });
                  },
                  filter: function filter(references) {
                    return { data: references.assets };
                  }
                })
              ),
              _react2.default.createElement(
                'div',
                { className: 'form-group' },
                _react2.default.createElement(
                  'label',
                  null,
                  'Sign Reason filled to pdf'
                ),
                _react2.default.createElement('input', { type: 'text', placeholder: 'signed...', value: pdfSign.reason, onChange: function onChange(v) {
                    return _this4.updateSign(entity, { reason: v.target.value });
                  } })
              )
            )
          )
        )
      );
    }
  }]);

  return PdfUtilsEditor;
}(_react.Component);

exports.default = PdfUtilsEditor;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {"operationTable":"x-pdf-utils-style-operationTable","tabContainer":"x-pdf-utils-style-tabContainer","tabTitles":"x-pdf-utils-style-tabTitles","tabTitle":"x-pdf-utils-style-tabTitle","active":"x-pdf-utils-style-active","tabPanel":"x-pdf-utils-style-tabPanel"};

/***/ })
/******/ ]);