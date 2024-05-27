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

function render(){
  const pythonProcess = child_process.spawn('python3',["renderH5.py",datafile]);
  pythonProcess.on('exit', function() {
    io.emit('update', true);
  })
}

app.get('/', function(req, res){
  fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});

app.get('/image', (req, res) => {
  const imageBuffer = fs.readFileSync(imagefile);
  res.send(imageBuffer);
});

var fsTimeout

fs.watch(datafile, (eventType, filename) => {
  if (fsTimeout) {
    return;
  }

  if(io.of("/").sockets.size==0){
    should_render_on_connect=true;
    return;
  }
  render();
  fsTimeout = setTimeout(function() { fsTimeout=null }, 2000)
});

io.on('connect', function(){
  if(should_render_on_connect){
    should_render_on_connect=false;
    render();
  }
});

server.listen(PORT, () => {
  console.log('Server is running on port 8080');
});