a.config - Node.js config system
========

Installation
------------

### A.Config module for node.js

```
npm install a.config
```

#### Usage

```javascript
var config = require('a.config');

config.load(__dirname + '/config.js');

console.log(config);
```

API
---

You can use keywords for extend your configs:

`$extends` - Extend current object with another object. You can use `:` to find object in root or not use for current lavel

**Example**

Original
```javascript
module.exports = {
    production: {
        server: {
            host: 'localhost',
            port: 3003
        }
    },

    development: { $extends: 'production',
        server: {
            port: 3002,
            options: { someOpt: false }
        }
    }
};
```
Result
```javascript
{
	"production": {
		"server": {
			"host": "localhost",
			"port": 3003
		}
	},
	"development": {
		"server": {
			"port": 3002,
			"options": {
				"someOpt": false
			},
			"host": "localhost"
		}
	}
}
```

`$inner` - For replace full object in `$extend` you must set to `false` in parent or child settings

**Example**

Original
```javascript
module.exports = {
    production: {
        server: {
            host: 'localhost',
            port: 3003,
            options: { $inner: false,
              auto_reconnect: true
            }
        }
    },

    development: { $extends: 'production', // or $extends: ':production' in current exmaple be right
        server: {
            port: 3002,
            options: { native_parser: false }
        }
    }
};
```
Result
```javascript
{
	"production": {
		"server": {
			"host": "localhost",
			"port": 3003,
			"options": {
				"auto_reconnect": true
			}
		}
	},
	"development": {
		"server": {
			"port": 3002,
			"options": {
				"native_parser": false
			},
			"host": "localhost"
		}
	}
}
```

`$include` - Use for include some else config file, remember include extend current object with comilled config file 


**Example**

Original
```javascript
module.exports = {
    production: { $include: 'config.production.js',
        server: {
            port: 3003
        },
        servers: {$inner: false,
            server1: {
                host: '127.0.0.1'
            },
            server2: {
                host: '127.0.0.2'
            }
        },
        server3: {a1: true}
    },

    development: { $extends: 'production',
        server: {
            port: 3002,
            options: { $inner: false,
                someOpt3: false
            }
        },
        servers: {
            server3: {
                host: '127.0.0.3'
            }
        }
    }
};
```
Result
```javascript
{
	"production": {
		"server": {
			"port": 3003,
			"host": "localhost",
			"options": {
				"someOpt1": true,
				"someOpt2": [
					"a1",
					"a2"
				]
			}
		},
		"servers": {
			"server1": {
				"host": "127.0.0.1"
			},
			"server2": {
				"host": "127.0.0.2"
			}
		},
		"server3": {
			"a1": true
		}
	},
	"development": {
		"server": {
			"port": 3002,
			"options": {
				"someOpt3": false
			},
			"host": "localhost"
		},
		"servers": {
			"server3": {
				"host": "127.0.0.3"
			}
		},
		"server3": {
			"a1": true
		}
	}
}
```


The MIT License (MIT)

Copyright (c) 2013 Andrew Sumskoy <andy@away.name>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
