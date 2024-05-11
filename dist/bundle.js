/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./logReader/logger.js":
/*!*****************************!*\
  !*** ./logReader/logger.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/**
 * 
 * @param {string} type 
 * @param {WebSocket} clientWebsocket 
 * @param {boolean} isUseThrottle // 是否使用节流
 * @returns 
 */
const logger = (type, clientWebsocket, isUseThrottle = true) => {
	const msgPool = []
	let timer = null;
	const throttle = (fn, delay, ...args) => {
		if (timer) {
			const msg = getMsg(...args);
			msgPool.push(msg)
			return
		}
		timer = setTimeout(() => {
			fn(...args)
			timer = null;  // 清除 timer
		}, delay)
	}

	const getMsg = (...args) => {
		const timestamp = new Date().toLocaleString();
		return JSON.stringify({
			type,
			timestamp,
			msg: [...args].map(arg => {
				try {
					return JSON.stringify(arg);
				} catch (error) {
					return `Error in stringifying argument: ${error.message}`;
				}
			}).join(',')
		})
	}

	const sendMsg = (...args) => {
		if (clientWebsocket) {
			const msg = getMsg(...args);
			msgPool.push(msg)
			if (clientWebsocket.readyState === 1) {
				if (msgPool.length > 0) {
					// msgPool.forEach(i => clientWebsocket.send(i))
					clientWebsocket.send(JSON.stringify([...msgPool]))
					msgPool.length = 0
				}
			} 
		}
	}

	return {
		log: function (...args) {
			if (isUseThrottle) {
				throttle(sendMsg, 200, ...args)
			} else {
				sendMsg(...args)
			}
			console.log(...args)
			// console.log(timestamp, JSON.stringify({type, timestamp, msg: [...args].map(i=>JSON.stringify(i)).join(',')}))
		},
		error: function (...args) {
			console.error(type)
			console.error(...args)
		},
		warn: function (...args) {
			console.warn(type)
			console.warn(...args)
		},
		info: function (...args) {
			console.info(type)
			console.info(...args)
		},
	}
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (logger);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./logReader/index.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger */ "./logReader/logger.js");




const websocket = new WebSocket(`ws://${window.location.host}`)
const logService = (0,_logger__WEBPACK_IMPORTED_MODULE_0__["default"])('logReader', websocket)

logService.log('WebSocket Client Connected', {'ah': 11});
console.log(logService);

let msgInfoObj = {
}
let curFilter = ''




websocket.onopen = () => {
	websocket.send('Hi this is WebSocket Client');
	websocket.onmessage = (message) => {
		console.log(message.data);
		try {
			const { type, msg } = JSON.parse(message.data)
			if (!msgInfoObj[type]) {
				msgInfoObj[type] = []
			}
			msgInfoObj[type].push(msg)
			render()
		} catch (error) {

		}
	}
}

websocket.onclose = () => {
	console.log('WebSocket Client Disconnected');
}

function updateLog(){
	const preElement = document.getElementById('logContent')
	if (curFilter) {
		preElement.innerHTML = ''
		const msgAry = []
		msgInfoObj[curFilter].forEach((msg) => {
			msgAry.push(msg)
		})
		preElement.innerHTML = msgAry.join('\n')
	}
}

let typeAry = Object.keys(msgInfoObj);
const select = document.getElementById('logFilter')
select.onchange = (e) => {
	curFilter = e.target.value
	select.value = curFilter
}

function render() {
	// logger.log(' msgInfoObj: ', msgInfoObj);
	// update option in select 
	if(typeAry.length !== Object.keys(msgInfoObj).length){
		// only render when option changed 
		select.innerHTML = `<option value="">请选择log类型</option>`
		typeAry = Object.keys(msgInfoObj);
		typeAry.forEach((type) => {
			const option = document.createElement('option')
			option.value = type
			option.text = type
			select.add(option)
		})
	}
	// update log
	updateLog()
}


})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map