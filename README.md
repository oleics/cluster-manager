cluster-manager

A module for Node.js that manages a cluster.

Usage

```js
var cm = require('cluster-manager');
var options = {
  port:     80,        // port to listen to
  hostname: '0.0.0.0', // hostname to bind to
  user:     'node',    // the user to set a worker-process to
  app_path: null       // path to app a worker serves
};
cm.run(options);
```
