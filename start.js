import * as fs from 'fs';
import express from 'express';
import * as http from 'http'
import * as child_process from 'child_process';
import {Server} from 'socket.io';

const app = express();
const server = http.createServer(app);
var io = new Server(server);

const datafile = "new.h5"
const imagefile = "new.jpeg"
const PORT = 8080
var should_render_on_connect = false;

function sendFile(res){
  const imageBuffer = fs.readFileSync(imagefile);
  res.send(imageBuffer);
}

app.get('/', function(req, res){
  fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});

app.get('/image', (req, res) => {
  if(!should_render_on_connect){
    sendFile(res);
    return;
  }

  const pythonProcess = child_process.spawn('python3',["renderH5.py",datafile]);
  pythonProcess.on('exit', function() {  
    sendFile(res);
  })
  should_render_on_connect = false;
});

var fsTimeout
fs.watch(datafile, (eventType, filename) => {
  if (fsTimeout) {
    return;
  }
  should_render_on_connect=true;
  fsTimeout = setTimeout(function() { fsTimeout=null }, 2000)
});

server.listen(PORT, () => {
  console.log('Server is running on port 8080');
});