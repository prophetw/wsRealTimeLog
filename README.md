# nodejs will start a websocket server on port 3000 

# To start the server, run the following command:
```bash
node websocket.js
# log to websocket real-time
# use frontend webpage to read log in real time

```

# frontend
```bash
pnpm install
pnpm start
```

# in your node js or other programe language
```js app.js
// init websocket 
const clientWS = new WebSocketServer({port: 8796});
/**
 * @param {string} type
 * @param {WebSocket} clientWebsocket
 */
const logger = (type, clientWebsocket) => {
	return {
		log: function (...args) {
			const timestamp = new Date().toISOString();
			if(clientWebsocket){
				clientWebsocket.send(JSON.stringify({type, timestamp, msg: [...args].map(i=>JSON.stringify(i)).join(',')}))
			}
			console.log(...args)

			console.log(timestamp, JSON.stringify({type, timestamp, msg: [...args].map(i=>JSON.stringify(i)).join(',')}))
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
const logService = logger('appjs')

// replace console.log with logService.log
logService.log(1, 2, 3);

```