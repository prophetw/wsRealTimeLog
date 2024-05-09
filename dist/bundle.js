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
 * @returns 
 */
const logger = (type, clientWebsocket) => {
	const msgPool = []
	return {
		log: function (...args) {
			const timestamp = new Date().toLocaleString();
			if(clientWebsocket){
				const msg = JSON.stringify({
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
				if(clientWebsocket.readyState === 1){
					clientWebsocket.send(msg)
					if(msgPool.length){
						msgPool.forEach(i=>clientWebsocket.send(i))
						msgPool.length = 0
					}
				}else{
					msgPool.push(msg)
				}
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



const websocket = new WebSocket('ws://localhost:8796')
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
			updateRender()
		} catch (error) {

		}
	}
}

websocket.onclose = () => {
	console.log('WebSocket Client Disconnected');
}

function updateRender() {
	// logger.log(' msgInfoObj: ', msgInfoObj);
	const select = document.getElementById('logFilter')
	// update option in select 
	select.innerHTML = `<option value="">请选择log类型</option>`
	Object.keys(msgInfoObj).forEach((type) => {
		const option = document.createElement('option')
		option.value = type
		option.text = type
		select.add(option)
	})
	select.onchange = (e) => {
		curFilter = e.target.value
		select.value = curFilter
		updateRender()
	}


	// update log
	const preElement = document.getElementById('logContent')
	preElement.innerHTML = ''

	if (curFilter) {
		select.value = curFilter
		const msgAry = []
		msgInfoObj[curFilter].forEach((msg) => {
			msgAry.push(msg)
		})
		preElement.innerHTML = msgAry.join('\n')

	}

}


})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map