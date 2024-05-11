const logger = (type, clientWebsocket, isUseThrottle = true, delay) => {
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
		return {
			type,
			timestamp,
			msg: [...args].map(arg => {
				try {
					return JSON.stringify(arg);
				} catch (error) {
					return `Error in stringifying argument: ${error.message}`;
				}
			}).join(',')
		}
	}

	const sendMsg = (...args) => {
		if (clientWebsocket) {
			const msg = getMsg(...args);
			msgPool.push(msg)
			if (clientWebsocket.readyState === 1) {
				if (msgPool.length > 0) {
					// msgPool.forEach(i => clientWebsocket.send(i))
					clientWebsocket.send(JSON.stringify(msgPool))
					msgPool.length = 0
				}
			} 
		}
	}

	return {
		log: function (...args) {
			if (isUseThrottle) {
				throttle(sendMsg, delay, ...args)
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
const aaaa = new WebSocket('ws://localhost:8796/')
const log = logger('test', aaaa, true, 1000)
setInterval(()=>{
    log.log(`${new Date().toLocaleString()}`,
        'aaaaa---', `hello ${Date.now()}`
    )
}, 10)

