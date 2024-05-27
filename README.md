# h5-plotting-server

## Requires 
**Node.js with epxress, fs, http, child_process** <br>
These can be installed with npm <br>
Python is used to render the h5 files thus requires **python3 matplotlib numpy h5py** <br>
These libraries can be installed with pip

## Usage
For local testing run 
```
node start.js
```

## Structure 
The server watches for file chnage on a specific file and when updated will render it into on image if a client is connected and servers it on refresh, otherwise it flags the server to render the image the next time a client connects and refreshs.