import logger from "./logger"



const websocket = new WebSocket(`ws://${window.location.host}`)
const logService = logger('logReader', websocket)

logService.log('WebSocket Client Connected', { 'ah': 11 });
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

function updateLog() {
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
	render();
}

function render() {
	// logger.log(' msgInfoObj: ', msgInfoObj);
	// update option in select 
	if (typeAry.length !== Object.keys(msgInfoObj).length) {
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

