# peloton-to-tcx

Get's Peloton workout data and creates a TCX file that can be uploaded to Strava or elsewhere.

This package can be required in another node module or used from CLI.


## Supported Fields

Cadence, Speed, Heart Rate, and Power are all supported. Power is an extension that is used by Strava, so it may not appear if you import the TCX to somewhere else.


## Storing Login Info, Optional

To avoid having to enter a login and password every time, you can create environment variables for `PELOTON_LOGIN` and `PELOTON_PASSWORD`. Or, you can store these in a file named `.env` next to the `package.json` file. The contents will look something like:

```
PELOTON_LOGIN=myusername
PELOTON_PASSWORD=mypassword
```

## CLI

If you install globally then `p2t -h` should be available and print use instructions. Or if installed locally, depending on your OS, run `node bin/p2t` or just `bin/p2t`.


## Use in Node

```js
var p2t = require('peloton-to-tcx');
p2t(options, callback);
```

The callback result when successful will be an array of TCX files.

### options

#### `limit` Number of recent workouts to convert
#### `resultsDirectory` Directory where TCX files should be saved, default is "./results"
#### `pLogin` Peloton username or email
#### `pPassword` Peloton password


## Tests

`npm test` requires environment variables be set for PELOTON_LOGIN and PELOTON_PASSWORD.


## License

MIT
