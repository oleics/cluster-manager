cluster-manager

A module for Node.js that manages a cluster.

Usage

```js
var cm = require('cluster-manager');
var options = {
  app: null // path to app a worker serves
};
cm.run(options);
```

See `./app/index.js` for a minimum app-file.

Features

 * Forks one worker per CPU by default (can be raised or lowered)
 * Reload of workers with a zero-down-time option
 * Commandline tool available

More features will be added by request.
