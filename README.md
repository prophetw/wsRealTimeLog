# To start the server, run the following command:
```bash
node express.js
# log to websocket real-time
# use frontend webpage to read log in real time

```

# frontend development
```bash
pnpm install
pnpm start
```

# in your node js or other programe language
```js 
// demo in logReader/test.js
// init websocket 
const clientWS = new WebSocket('ws://localhost:8796/')
const log = logger('test', aaaa, true, 1000)
// replace console.log() with log.log()
log.log('this is a log message');   // log to websocket real-time 
// http://localhost:8796/  // can check log here 
```