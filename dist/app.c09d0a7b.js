// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"scripts/app.js":[function(require,module,exports) {
var Portfolio = function Portfolio(options) {
  //letiables
  var speedFact = 20;
  var backgroundFactor;
  var zoomLimit = [1, backgroundFactor];
  var mousePosition = ['a', 'a'];
  var mousePositionTemp = ['a', 'a'];
  var center;
  var movementActive;
  var start = 'true';
  var imageSize = ['a', 'a'];
  var backgroundImage = new Image();
  var backgroundImageRatio;
  var screenRatio;
  var mobile;
  var steps = ['a', 'a'];
  var backgroundActualPosition = ['a', 'a'];
  var mode;
  var colorDecimal = [0, 0, 0];
  var colorHexadecimal;
  var tempColor = [0, 0];
  var stepColor = ['a', 'a']; //fonctions publiques

  function init(srcImg, backgroundValue) {
    backgroundFactor = backgroundValue;
    mode = "ARRET";
    document.getElementById('mode').innerHTML = mode;
    document.querySelector('main').style.background = '#000000';

    if (screen.height > screen.width) {
      mobile = true;
    } else {
      mobile = false;
    }

    document.getElementById('background').style.backgroundImage = "url(" + srcImg + ")";
    center = [window.innerWidth / 2, window.innerHeight / 2];
    backgroundImage.src = srcImg;

    backgroundImage.onload = function () {
      screenRatio = window.innerHeight / window.innerWidth;
      backgroundImageRatio = this.height / this.width;

      if (screenRatio > backgroundImageRatio) {
        imageSize[1] = window.innerHeight * backgroundFactor;
        imageSize[0] = imageSize[1] / backgroundImageRatio;
        document.getElementById('background').style.backgroundSize = (backgroundFactor * 100 * screenRatio / backgroundImageRatio).toString() + '%';
      } else {
        imageSize[0] = window.innerWidth * backgroundFactor;
        imageSize[1] = imageSize[0] * backgroundImageRatio;
        document.getElementById('background').style.backgroundSize = (backgroundFactor * 100).toString() + '%';
      }

      document.getElementById('background').style.backgroundPositionX = ((window.innerWidth - imageSize[0]) / 2).toString() + 'px';
      document.getElementById('background').style.backgroundPositionY = ((window.innerHeight - imageSize[1]) / 2).toString() + 'px';
      console.log(imageSize);
      document.getElementById('background').addEventListener("click", function (event) {
        toogleMovement();
      });
      backToMap();
      ratioImages('profilePicture'); // zoom('wheel');

      stepColor = [-(window.innerWidth - imageSize[0]) / 2 / 255, -(window.innerHeight - imageSize[1]) / 2 / 255];
      console.log(stepColor);
    };
  } //fonctions privées


  function toogleMovement() {
    //            if(mobile)
    //            {}
    //            else
    //            {
    if (start) {
      movementActive = setInterval(function () {
        vectorDirectionPC('mousemove');
      }, 17); //17 ms = 60fps

      mode = "DÉPLACEMENT";
      start = false;
    } else {
      clearInterval(movementActive);
      start = true;
      mode = "ARRET";
    } //          }


    document.getElementById('mode').innerHTML = mode;
  }

  function vectorDirectionPC(action) {
    document.addEventListener(action, function (event) {
      mousePosition = [event.pageX - center[0], event.pageY - center[1]];
    });

    if (mousePositionTemp[0] != mousePosition[0] || mousePositionTemp[1] != mousePosition[1]) {
      mousePositionTemp = mousePosition;
    }

    moveBackground();
  }

  function moveBackground() {
    steps[0] = (parseInt(document.getElementById('background').style.backgroundPositionX.replace('px', '')) - mousePosition[0] / speedFact).toString() + 'px';
    steps[1] = (parseInt(document.getElementById('background').style.backgroundPositionY.replace('px', '')) - mousePosition[1] / speedFact).toString() + 'px';
    backgroundActualPosition[0] = parseInt(document.getElementById('background').style.backgroundPositionX.replace('px', ''));
    backgroundActualPosition[1] = parseInt(document.getElementById('background').style.backgroundPositionY.replace('px', ''));

    if (backgroundActualPosition[0] > 0) {
      document.getElementById('leftPannel').classList.add('startAppearX');
      document.getElementById('background').style.backgroundPositionX = '0px';
      toogleMovement();
    }

    if (backgroundActualPosition[0] < -(imageSize[0] - window.innerWidth)) {
      // console.log('a');
      document.getElementById('rightPannel').classList.add('startAppearX');
      document.getElementById('background').style.backgroundPositionX = -(imageSize[0] - window.innerWidth) + 'px';
      toogleMovement();
    }

    if (backgroundActualPosition[1] > 0) {
      document.getElementById('background').style.backgroundPositionY = '0px';
    }

    if (backgroundActualPosition[1] < -(imageSize[1] - window.innerHeight)) {
      document.getElementById('bottomPannel').classList.add('startAppearY');
      document.getElementById('background').style.backgroundPositionY = -(imageSize[1] - window.innerHeight) + 'px';
      toogleMovement();
    }

    if ((backgroundActualPosition[0] < 0 || mousePosition[0] >= 0) && (backgroundActualPosition[0] > -(imageSize[0] - window.innerWidth) || mousePosition[0] <= 0)) {
      document.getElementById('background').style.backgroundPositionX = steps[0];
    }

    if ((backgroundActualPosition[1] < 0 || mousePosition[1] >= 0) && (backgroundActualPosition[1] > -(imageSize[1] - window.innerHeight) || mousePosition[1] <= 0)) {
      document.getElementById('background').style.backgroundPositionY = steps[1];
    }

    color(); //console.log(backgroundActualPosition[0]);
    //  console.log(imageSize[0]-window.innerWidth);
  }

  function zoom(action) {
    document.addEventListener(action, function (event) {
      event.preventDefault(); // console.log(event.pageX);
      // console.log(event.pageY);

      var sign = -event.deltaY / Math.abs(event.deltaY);
      var canScroll = false;

      if (backgroundFactor >= zoomLimit[0] && backgroundFactor <= zoomLimit[1]) {
        canScroll = true;
      } else {
        if (backgroundFactor < zoomLimit[0] && sign > 0) {
          canScroll = true;
        } else if (backgroundFactor > zoomLimit[1] && sign < 0) {
          canScroll = true;
        }
      }

      if (canScroll) {
        vectorDirectionPC(action);
        backgroundFactor += sign * 0.1;

        if (screenRatio > backgroundImageRatio) {
          document.getElementById('background').style.backgroundSize = (backgroundFactor * 100 * screenRatio / backgroundImageRatio).toString() + '%';
        } else {
          document.getElementById('background').style.backgroundSize = (backgroundFactor * 100).toString() + '%';
        }
      }
    });
  } //.log(document.querySelector('main').style.backgroundPosition);


  function color() {
    tempColor[0] = (parseInt(document.getElementById('background').style.backgroundPositionX.replace('px', '')) - (window.innerWidth - imageSize[0]) / 2) / stepColor[0];
    tempColor[1] = (parseInt(document.getElementById('background').style.backgroundPositionY.replace('px', '')) - (window.innerHeight - imageSize[1]) / 2) / stepColor[1];

    if (tempColor[0] < 0) {
      colorDecimal[0] = -Math.round(tempColor[0]);
    } else {
      colorDecimal[1] = Math.round(tempColor[0]);
    }

    if (tempColor[1] < 0) {
      colorDecimal[2] = -Math.round(tempColor[1]);
    } else {
      colorDecimal[2] = 0;
    }

    colorHexadecimal = '#';

    if (colorDecimal[0] == 0) {
      colorHexadecimal += '00';
    } else if (colorDecimal[0] <= 16) {
      colorHexadecimal += '0' + colorDecimal[0].toString(16);
    } else {
      colorHexadecimal += colorDecimal[0].toString(16);
    }

    if (colorDecimal[1] == 0) {
      colorHexadecimal += '00';
    } else if (colorDecimal[1] <= 16) {
      colorHexadecimal += '0' + colorDecimal[1].toString(16);
    } else {
      colorHexadecimal += colorDecimal[1].toString(16);
    }

    if (colorDecimal[2] == 0) {
      colorHexadecimal += '00';
    } else if (colorDecimal[2] <= 16) {
      colorHexadecimal += '0' + colorDecimal[2].toString(16);
    } else {
      colorHexadecimal += colorDecimal[2].toString(16);
    }

    console.log(colorHexadecimal);
    document.querySelector('main').style.background = colorHexadecimal;
  }

  function backToMap() {
    document.getElementById('exitPresentation').addEventListener('click', function () {
      document.getElementById('background').style.backgroundPositionX = ((window.innerWidth - imageSize[0]) / 2).toString() + 'px';
      document.getElementById('background').style.backgroundPositionY = ((window.innerHeight - imageSize[1]) / 2).toString() + 'px';
      document.getElementById('leftPannel').classList.remove('startAppearX');
      document.getElementById('leftPannel').classList.add('startLeaveLeft');
      setTimeout(function () {
        document.getElementById('leftPannel').classList.remove('startLeaveLeft');
      }, 1000);
    });
  }

  function ratioImages(image) {
    console.log(document.getElementById(image).clientWidth.toString() + 'px');
    document.getElementById(image).style.height = document.getElementById(image).clientWidth.toString() + 'px';
    console.log(document.getElementById(image).clientHeight.toString() + 'px');
  }

  return {
    init: init
  };
};
},{}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51069" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","scripts/app.js"], null)
//# sourceMappingURL=/app.c09d0a7b.js.map