define(["app/core/table_model","app/plugins/sdk","lodash","moment"], function(__WEBPACK_EXTERNAL_MODULE_grafana_app_core_table_model__, __WEBPACK_EXTERNAL_MODULE_grafana_app_plugins_sdk__, __WEBPACK_EXTERNAL_MODULE_lodash__, __WEBPACK_EXTERNAL_MODULE_moment__) { return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./module.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/scriptjs/dist/script.js":
/*!***********************************************!*\
  !*** ../node_modules/scriptjs/dist/script.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  * $script.js JS loader & dependency manager
  * https://github.com/ded/script.js
  * (c) Dustin Diaz 2014 | License MIT
  */

(function (name, definition) {
  if ( true && module.exports) module.exports = definition()
  else if (true) !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  else {}
})('$script', function () {
  var doc = document
    , head = doc.getElementsByTagName('head')[0]
    , s = 'string'
    , f = false
    , push = 'push'
    , readyState = 'readyState'
    , onreadystatechange = 'onreadystatechange'
    , list = {}
    , ids = {}
    , delay = {}
    , scripts = {}
    , scriptpath
    , urlArgs

  function every(ar, fn) {
    for (var i = 0, j = ar.length; i < j; ++i) if (!fn(ar[i])) return f
    return 1
  }
  function each(ar, fn) {
    every(ar, function (el) {
      fn(el)
      return 1
    })
  }

  function $script(paths, idOrDone, optDone) {
    paths = paths[push] ? paths : [paths]
    var idOrDoneIsDone = idOrDone && idOrDone.call
      , done = idOrDoneIsDone ? idOrDone : optDone
      , id = idOrDoneIsDone ? paths.join('') : idOrDone
      , queue = paths.length
    function loopFn(item) {
      return item.call ? item() : list[item]
    }
    function callback() {
      if (!--queue) {
        list[id] = 1
        done && done()
        for (var dset in delay) {
          every(dset.split('|'), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = [])
        }
      }
    }
    setTimeout(function () {
      each(paths, function loading(path, force) {
        if (path === null) return callback()
        
        if (!force && !/^https?:\/\//.test(path) && scriptpath) {
          path = (path.indexOf('.js') === -1) ? scriptpath + path + '.js' : scriptpath + path;
        }
        
        if (scripts[path]) {
          if (id) ids[id] = 1
          return (scripts[path] == 2) ? callback() : setTimeout(function () { loading(path, true) }, 0)
        }

        scripts[path] = 1
        if (id) ids[id] = 1
        create(path, callback)
      })
    }, 0)
    return $script
  }

  function create(path, fn) {
    var el = doc.createElement('script'), loaded
    el.onload = el.onerror = el[onreadystatechange] = function () {
      if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) return;
      el.onload = el[onreadystatechange] = null
      loaded = 1
      scripts[path] = 2
      fn()
    }
    el.async = 1
    el.src = urlArgs ? path + (path.indexOf('?') === -1 ? '?' : '&') + urlArgs : path;
    head.insertBefore(el, head.lastChild)
  }

  $script.get = create

  $script.order = function (scripts, id, done) {
    (function callback(s) {
      s = scripts.shift()
      !scripts.length ? $script(s, id, done) : $script(s, callback)
    }())
  }

  $script.path = function (p) {
    scriptpath = p
  }
  $script.urlArgs = function (str) {
    urlArgs = str;
  }
  $script.ready = function (deps, ready, req) {
    deps = deps[push] ? deps : [deps]
    var missing = [];
    !each(deps, function (dep) {
      list[dep] || missing[push](dep);
    }) && every(deps, function (dep) {return list[dep]}) ?
      ready() : !function (key) {
      delay[key] = delay[key] || []
      delay[key][push](ready)
      req && req(missing)
    }(deps.join('|'))
    return $script
  }

  $script.done = function (idOrDone) {
    $script([null], idOrDone)
  }

  return $script
});


/***/ }),

/***/ "./annotations_query_ctrl.ts":
/*!***********************************!*\
  !*** ./annotations_query_ctrl.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var GoogleSpreadsheetsAnnotationsQueryCtrl =
/** @class */
function () {
  function GoogleSpreadsheetsAnnotationsQueryCtrl($scope, $injector) {
    this.scope = $scope;
  }

  GoogleSpreadsheetsAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
  return GoogleSpreadsheetsAnnotationsQueryCtrl;
}();

exports.GoogleSpreadsheetsAnnotationsQueryCtrl = GoogleSpreadsheetsAnnotationsQueryCtrl;

/***/ }),

/***/ "./datasource.ts":
/*!***********************!*\
  !*** ./datasource.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GoogleSpreadsheetsDatasource = undefined;

var _lodash = __webpack_require__(/*! lodash */ "lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = __webpack_require__(/*! moment */ "moment");

var _moment2 = _interopRequireDefault(_moment);

var _table_model = __webpack_require__(/*! grafana/app/core/table_model */ "grafana/app/core/table_model");

var _table_model2 = _interopRequireDefault(_table_model);

var _scriptjs = __webpack_require__(/*! scriptjs */ "../node_modules/scriptjs/dist/script.js");

var _scriptjs2 = _interopRequireDefault(_scriptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = undefined && undefined.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var GoogleSpreadsheetsDatasource =
/** @class */
function () {
  function GoogleSpreadsheetsDatasource(instanceSettings, $q, templateSrv, timeSrv) {
    this.type = instanceSettings.type;
    this.name = instanceSettings.name;
    this.id = instanceSettings.id;
    this.access = instanceSettings.jsonData.access || 'direct';
    this.clientId = instanceSettings.jsonData.clientId;
    this.scopes = 'https://www.googleapis.com/auth/spreadsheets.readonly';
    this.discoveryDocs = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
    this.q = $q;
    this.templateSrv = templateSrv;
    this.timeSrv = timeSrv;
    this.initialized = false;
  }

  GoogleSpreadsheetsDatasource.prototype.load = function () {
    return __awaiter(this, void 0, void 0, function () {
      var deferred;
      return __generator(this, function (_a) {
        deferred = this.q.defer();
        (0, _scriptjs2.default)('https://apis.google.com/js/api.js', function () {
          gapi.load('client:auth2', function () {
            gapi.client.load('sheets', 'v4', function () {
              return deferred.resolve();
            });
          });
        });
        return [2
        /*return*/
        , deferred.promise];
      });
    });
  };

  GoogleSpreadsheetsDatasource.prototype.initialize = function () {
    return __awaiter(this, void 0, void 0, function () {
      var authInstance, isSignedIn, user;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (this.access == 'proxy') {
              return [2
              /*return*/
              , Promise.resolve([])]; // not supported
            }

            if (this.initialized) {
              return [2
              /*return*/
              , Promise.resolve(gapi.auth2.getAuthInstance().currentUser.get())];
            }

            return [4
            /*yield*/
            , this.load()];

          case 1:
            _a.sent();

            return [4
            /*yield*/
            , gapi.client.init({
              clientId: this.clientId,
              scope: this.scopes,
              discoveryDocs: this.discoveryDocs
            })];

          case 2:
            _a.sent();

            authInstance = gapi.auth2.getAuthInstance();

            if (!authInstance) {
              throw {
                message: 'failed to initialize'
              };
            }

            isSignedIn = authInstance.isSignedIn.get();

            if (isSignedIn) {
              this.initialized = true;
              return [2
              /*return*/
              , authInstance.currentUser.get()];
            }

            return [4
            /*yield*/
            , authInstance.signIn()];

          case 3:
            user = _a.sent();
            this.initialized = true;
            return [2
            /*return*/
            , user];
        }
      });
    });
  };

  GoogleSpreadsheetsDatasource.prototype.testDatasource = function () {
    return __awaiter(this, void 0, void 0, function () {
      var err_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2,, 3]);

            return [4
            /*yield*/
            , this.initialize()];

          case 1:
            _a.sent();

            return [2
            /*return*/
            , {
              status: 'success',
              message: 'Data source is working',
              title: 'Success'
            }];

          case 2:
            err_1 = _a.sent();
            return [2
            /*return*/
            , {
              status: "error",
              message: err_1.message,
              title: "Error"
            }];

          case 3:
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  GoogleSpreadsheetsDatasource.prototype.query = function (options) {
    return __awaiter(this, void 0, void 0, function () {
      var results, data;

      var _this = this;

      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this.initialize()];

          case 1:
            _a.sent();

            return [4
            /*yield*/
            , Promise.all(options.targets.filter(function (t) {
              return !t.hide;
            }).map(function (t) {
              return _this.getValues(t.spreadsheetId, t.range, t.transpose);
            }))];

          case 2:
            results = _a.sent();
            data = results.map(function (result, i) {
              switch (options.targets[i].resultFormat) {
                case 'table':
                  var table = new _table_model2.default();
                  table.columns = result.values[0].map(function (v, i) {
                    return {
                      text: "c" + i,
                      type: 'string'
                    };
                  });
                  table.rows = result.values;
                  return table;

                default:
                  return {
                    target: _this.renderTemplate(options.targets[i].aliasFormat, {
                      range: result.range
                    }),
                    datapoints: result.values.map(function (v) {
                      return [parseFloat(v[0]), parseFloat(v[1])];
                    })
                  };
              }
            });
            return [2
            /*return*/
            , {
              data: data
            }];
        }
      });
    });
  };

  GoogleSpreadsheetsDatasource.prototype.metricFindQuery = function (query) {
    return __awaiter(this, void 0, void 0, function () {
      var cellValuesQuery, result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            cellValuesQuery = query.match(/^cell_values\(([^,]+?),\s?([^,]+?)\)/);
            if (!cellValuesQuery) return [3
            /*break*/
            , 2];
            return [4
            /*yield*/
            , this.getValues(cellValuesQuery[1], cellValuesQuery[2])];

          case 1:
            result = _a.sent();
            return [2
            /*return*/
            , _lodash2.default.uniq(result.values.flat()).map(function (v) {
              return {
                text: v
              };
            })];

          case 2:
            return [2
            /*return*/
            , this.q.when([])];
        }
      });
    });
  };

  GoogleSpreadsheetsDatasource.prototype.annotationQuery = function (options) {
    return __awaiter(this, void 0, void 0, function () {
      var annotation, spreadsheetId, range, timeKeys, timeFormat, titleFormat, textFormat, tagKeys, filter, result, eventList;

      var _this = this;

      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this.initialize()];

          case 1:
            _a.sent();

            annotation = options.annotation;
            spreadsheetId = annotation.spreadsheetId || '';
            range = annotation.range || '';
            timeKeys = (annotation.timeKeys || '0,1').split(',');
            timeFormat = annotation.timeFormat || '';
            titleFormat = annotation.titleFormat || '{{2}}';
            textFormat = annotation.textFormat || '{{3}}';
            tagKeys = (annotation.tagKeys || '2,3').split(',');
            filter = annotation.filter || '';

            if (!spreadsheetId || !range) {
              return [2
              /*return*/
              , []];
            }

            return [4
            /*yield*/
            , this.getValues(spreadsheetId, range)];

          case 2:
            result = _a.sent();

            if (_lodash2.default.isEmpty(result)) {
              return [2
              /*return*/
              , []];
            }

            eventList = result.values.filter(function (value) {
              if (!filter) {
                return true;
              }

              return true;
            }).map(function (value, i) {
              var tags = value.filter(function (v, k) {
                return tagKeys.includes(String(k));
              });
              var timeFrom = timeFormat ? (0, _moment2.default)(value[timeKeys[0]], timeFormat).valueOf() : parseInt(value[timeKeys[0]], 10);
              var event = [{
                annotation: annotation,
                time: timeFrom,
                title: _this.renderTemplate(titleFormat, value),
                text: _this.renderTemplate(textFormat, value),
                tags: tags
              }];

              if (timeKeys.length === 2) {
                var timeTo = timeFormat ? (0, _moment2.default)(value[timeKeys[1]], timeFormat).valueOf() : parseInt(value[timeKeys[1]], 10);
                event[0].regionId = spreadsheetId + i;
                event.push({
                  regionId: spreadsheetId + i,
                  annotation: annotation,
                  time: timeTo,
                  title: _this.renderTemplate(titleFormat, value),
                  text: _this.renderTemplate(textFormat, value),
                  tags: tags
                });
              }

              return event;
            }).flat();
            return [2
            /*return*/
            , eventList];
        }
      });
    });
  };

  GoogleSpreadsheetsDatasource.prototype.getValues = function (spreadsheetId, range, transpose) {
    if (transpose === void 0) {
      transpose = false;
    }

    return __awaiter(this, void 0, void 0, function () {
      var response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , gapi.client['sheets'].spreadsheets.values.get({
              spreadsheetId: spreadsheetId,
              range: range
            })];

          case 1:
            response = _a.sent();

            if (transpose) {
              response.result.values = _lodash2.default.unzip(response.result.values);
            }

            return [2
            /*return*/
            , response.result];
        }
      });
    });
  };

  GoogleSpreadsheetsDatasource.prototype.renderTemplate = function (aliasPattern, aliasData) {
    var aliasRegex = /\{\{\s*(.+?)\s*\}\}/g;
    return aliasPattern.replace(aliasRegex, function (match, g1) {
      if (aliasData[g1]) {
        return aliasData[g1];
      }

      return g1;
    });
  };

  return GoogleSpreadsheetsDatasource;
}();

exports.GoogleSpreadsheetsDatasource = GoogleSpreadsheetsDatasource;

/***/ }),

/***/ "./module.ts":
/*!*******************!*\
  !*** ./module.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnnotationsQueryCtrl = exports.QueryCtrl = exports.ConfigCtrl = exports.Datasource = undefined;

var _datasource = __webpack_require__(/*! ./datasource */ "./datasource.ts");

var _query_ctrl = __webpack_require__(/*! ./query_ctrl */ "./query_ctrl.ts");

var _annotations_query_ctrl = __webpack_require__(/*! ./annotations_query_ctrl */ "./annotations_query_ctrl.ts");

var GoogleSpreadsheetsConfigCtrl =
/** @class */
function () {
  function GoogleSpreadsheetsConfigCtrl() {}

  GoogleSpreadsheetsConfigCtrl.templateUrl = 'partials/config.html';
  return GoogleSpreadsheetsConfigCtrl;
}();

exports.Datasource = _datasource.GoogleSpreadsheetsDatasource;
exports.ConfigCtrl = GoogleSpreadsheetsConfigCtrl;
exports.QueryCtrl = _query_ctrl.GoogleSpreadsheetsQueryCtrl;
exports.AnnotationsQueryCtrl = _annotations_query_ctrl.GoogleSpreadsheetsAnnotationsQueryCtrl;

/***/ }),

/***/ "./query_ctrl.ts":
/*!***********************!*\
  !*** ./query_ctrl.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GoogleSpreadsheetsQueryCtrl = undefined;

var _sdk = __webpack_require__(/*! grafana/app/plugins/sdk */ "grafana/app/plugins/sdk");

var __extends = undefined && undefined.__extends || function () {
  var extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) {
      if (b.hasOwnProperty(p)) d[p] = b[p];
    }
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var GoogleSpreadsheetsQueryCtrl =
/** @class */
function (_super) {
  __extends(GoogleSpreadsheetsQueryCtrl, _super);

  function GoogleSpreadsheetsQueryCtrl($scope, $injector) {
    var _this = _super.call(this, $scope, $injector) || this;

    _this.scope = $scope;
    _this.resultFormats = [{
      text: 'Time series',
      value: 'time_series'
    }, {
      text: 'Table',
      value: 'table'
    }];
    return _this;
  }

  GoogleSpreadsheetsQueryCtrl.prototype.onChangeInternal = function () {
    this.panelCtrl.refresh();
  };

  GoogleSpreadsheetsQueryCtrl.templateUrl = 'partials/query.editor.html';
  return GoogleSpreadsheetsQueryCtrl;
}(_sdk.QueryCtrl);

exports.GoogleSpreadsheetsQueryCtrl = GoogleSpreadsheetsQueryCtrl;

/***/ }),

/***/ "grafana/app/core/table_model":
/*!***************************************!*\
  !*** external "app/core/table_model" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_grafana_app_core_table_model__;

/***/ }),

/***/ "grafana/app/plugins/sdk":
/*!**********************************!*\
  !*** external "app/plugins/sdk" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_grafana_app_plugins_sdk__;

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_lodash__;

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_moment__;

/***/ })

/******/ })});;
//# sourceMappingURL=module.js.map