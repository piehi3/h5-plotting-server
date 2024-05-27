import * as fs from "fs";
import express from 'express';
import * as child_process from "child_process";

const app = express();

const datafile = "new.h5"
const imagefile = "new.jpeg"
const PORT = 8080

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
  if (!fsTimeout) {
    console.log("Rendering New File")
    const pythonProcess = child_process.spawn('python3',["renderH5.py",datafile]);
    fsTimeout = setTimeout(function() { fsTimeout=null }, 2000)
  }
});

app.listen(PORT, () => {
  console.log('Server is running on port 8080');
});