// websocket server
// websocket server
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8796});


wss.on('connection', function(ws) {
	ws.on('message', function(message) {
		console.log('received: %s', message);
		try {
			const msgObj = JSON.parse(message);
			console.log(msgObj);
			const {type, timestamp, msg} = msgObj;
			ws.send(JSON.stringify({
				type: type || 'default',
				msg: `${timestamp}, ${msg}`
			}));
		} catch (error) {
			ws.send(JSON.stringify({
				type: 'hello',
				msg: `${message}`
			}));
		}
	});
});