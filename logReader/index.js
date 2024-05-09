import logger from "./logger"


const websocket = new WebSocket('ws://localhost:8796')
const logService = logger('logReader', websocket)

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

