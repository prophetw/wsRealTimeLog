const express = require('express')

// const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// static server
app.use(express.static('dist'));
// need cors 
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

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

server.listen(8796, () => {
    console.log('Listening on http://localhost:8796');
});
