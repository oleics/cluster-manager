# cluster-manager

A module for Node.js that manages a cluster.

## Install

`npm install cluster-manager`

## Usage

```js
var cm = require('cluster-manager');
var options = {
  app: './app' // path to app a worker serves
};
var master = cm.run(options);
if(master) {
  // we're in the master-process
}
```

See `./app/index.js` for a minimum app-file.

## Master Interface

array `.getPIDs()`  
worker `.fork([cb])`  
`.stop(pid)`  
`.restart(pid)`  
`.restartAll()`  
`.restartZDT(pid)`  
`.restartAllZDT()`  

## Features

 * Forks one worker per CPU by default (can be raised or lowered)
 * Reload of workers with a zero-down-time option
 * Commandline tool available

More features will be added by request.
