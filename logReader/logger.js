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

export default logger;