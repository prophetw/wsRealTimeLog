const express = require('express')

// const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 存储所有活跃的连接
const clients = new Set();

// static server
app.use(express.static('dist'));
// need cors 
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

function broadcast(message, sender) {
	for (let client of clients) {
			if (client !== sender && client.readyState === WebSocket.OPEN) {
					try {
							const msgObj = JSON.parse(message);
							if(Array.isArray(msgObj)){
								const type = msgObj[0].type || 'default';
								const msg = msgObj.map(i => i.msg).join('\n');
								client.send(JSON.stringify({
										type,
										msg
								}));
							}else{
								const {type, msg} = msgObj;
								client.send(JSON.stringify({
										type: type || 'default',
										msg: `${msg}`
								}));
							}
					} catch (error) {
							client.send(JSON.stringify({
									type: 'error',
									msg: `Error in message format`
							}));
					}
			}
	}
}

wss.on('connection', function(ws) {
  clients.add(ws);

	ws.on('message', function(message) {
		// console.log('Received: %s', message);
		broadcast(message, ws);
	});

	ws.on('close', function() {
		clients.delete(ws);
	});

	ws.on('error', function(e) {
			console.log('WebSocket error: ', e);
	});
});

server.listen(8796, () => {
    console.log('Listening on http://localhost:8796');
});
