/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _jsreportStudio = __webpack_require__(1);
	
	var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);
	
	var _TemplatePdfUtilsProperties = __webpack_require__(2);
	
	var _TemplatePdfUtilsProperties2 = _interopRequireDefault(_TemplatePdfUtilsProperties);
	
	var _PdfUtilsTitle = __webpack_require__(5);
	
	var _PdfUtilsTitle2 = _interopRequireDefault(_PdfUtilsTitle);
	
	var _PdfUtilsEditor = __webpack_require__(6);
	
	var _PdfUtilsEditor2 = _interopRequireDefault(_PdfUtilsEditor);
	
	var _constants = __webpack_require__(4);
	
	var Constants = _interopRequireWildcard(_constants);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_jsreportStudio2.default.addPropertiesComponent(_TemplatePdfUtilsProperties2.default.title, _TemplatePdfUtilsProperties2.default, function (entity) {
	  return entity.__entitySet === 'templates';
	});
	
	_jsreportStudio2.default.addEditorComponent(Constants.PDF_UTILS_TAB_EDITOR, _PdfUtilsEditor2.default);
	_jsreportStudio2.default.addTabTitleComponent(Constants.PDF_UTILS_TAB_TITLE, _PdfUtilsTitle2.default);

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = Studio;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _jsreportStudio = __webpack_require__(1);
	
	var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);
	
	var _constants = __webpack_require__(4);
	
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

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = Studio.libraries['react'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var PDF_UTILS_TAB_TITLE = exports.PDF_UTILS_TAB_TITLE = 'PDF_UTILS_TAB_TITLE';
	var PDF_UTILS_TAB_EDITOR = exports.PDF_UTILS_TAB_EDITOR = 'PDF_UTILS_TAB_EDITOR';

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (props) {
	  return _react2.default.createElement(
	    'span',
	    null,
	    props.entity.name + ' pdf utils ' + (props.entity.__isDirty ? '*' : '')
	  );
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _jsreportStudio = __webpack_require__(1);
	
	var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);
	
	var _style = __webpack_require__(7);
	
	var _style2 = _interopRequireDefault(_style);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
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
	
	      var templates = _jsreportStudio2.default.getAllEntities().filter(function (e) {
	        return e.__entitySet === 'templates' && e.shortid !== entity.shortid && e.recipe.includes('pdf');
	      });
	
	      return _react2.default.createElement(
	        'tr',
	        { key: index },
	        _react2.default.createElement(
	          'td',
	          null,
	          _react2.default.createElement(
	            'select',
	            {
	              value: operation.templateShortid || 'empty',
	              onChange: function onChange(v) {
	                return _this2.updateOperation(entity, index, { templateShortid: v.target.value });
	              } },
	            _react2.default.createElement(
	              'option',
	              { key: 'empty', value: 'empty' },
	              '- not selected -'
	            ),
	            templates.map(function (e) {
	              return _react2.default.createElement(
	                'option',
	                { key: e.shortid, value: e.shortid },
	                e.name
	              );
	            })
	          )
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
	          _react2.default.createElement('input', { type: 'checkbox', disabled: operation.type !== 'merge', checked: operation.renderForEveryPage === true, onChange: function onChange(v) {
	              return _this2.updateOperation(entity, index, { renderForEveryPage: v.target.checked });
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

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(8);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(10)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!./../node_modules/postcss-loader/index.js!./../node_modules/sass-loader/index.js?outputStyle=expanded&sourceMap!./style.scss", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!./../node_modules/postcss-loader/index.js!./../node_modules/sass-loader/index.js?outputStyle=expanded&sourceMap!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(9)();
	// imports
	
	
	// module
	exports.push([module.id, ".operationTable___3ENuL {\n  border-collapse: collapse;\n  border: none;\n  overflow: scroll;\n}\n\n.operationTable___3ENuL th {\n  padding: 0.5rem;\n}\n\n.operationTable___3ENuL td:nth-child(3), td:nth-child(4), th:nth-child(3), th:nth-child(4) {\n  text-align: center;\n  padding-left: 1rem;\n  background-color: #F6F6F6;\n}\n", "", {"version":3,"sources":["/./studio/studio/style.scss"],"names":[],"mappings":"AAAA;EACE,0BAAyB;EACzB,aAAW;EACX,iBACF;CAAE;;AAEF;EACI,gBACJ;CAAE;;AAEF;EACI,mBAAkB;EAClB,mBAAkB;EAClB,0BACJ;CAAE","file":"style.scss","sourcesContent":[".operationTable {\r\n  border-collapse: collapse;\r\n  border:none;\r\n  overflow: scroll\r\n}\r\n\r\n.operationTable th {\r\n    padding: 0.5rem\r\n}\r\n\r\n.operationTable td:nth-child(3), td:nth-child(4), th:nth-child(3), th:nth-child(4)  {\r\n    text-align: center;    \r\n    padding-left: 1rem;   \r\n    background-color: #F6F6F6\r\n}"],"sourceRoot":"webpack://"}]);
	
	// exports
	exports.locals = {
		"operationTable": "operationTable___3ENuL"
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
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
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
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
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);