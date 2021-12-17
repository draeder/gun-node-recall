# gun-node-recall
Preserve Gun DB service account sessions between server restarts. 

> ⚠️ Take care that proper precautions to secure session data when using this library are considered. 
> The `opts` object is available for development and testing purposes--it should not be used in production!

## Install
```js
npm i gun-node-recall
```

## Usage

### Example
```js
require('gun-node-recall')
const Gun = require('gun')
const crypto = require('crypto')

const gun = new Gun()

let recall = await Gun.recall('', {filename: 'sessionStorage.json'})

if(!recall){
  let username = crypto.randomBytes(20).toString()
  let password = crypto.randomBytes(40).toString()

  user.create(username, password, async cb => {
    recall = await Gun.recall(user.recall(), {filename: 'sessionStorage.json'})
    gun.user().auth(recall)
  })
} else {
  gun.user().auth(recall)
}

let revoke = await Gun.revoke(recall, opts) // return the user's pub key
user.get(revoke).put(null) // delete the user

gun.on('auth', ack => console.log('Authentication was successful!'))
```

### `[opts]`
If no options are defined, session data is only stored in memory. To store session data between server restarts, specify the following options.

```js
let opts = {
  filename: 'sessionStorage.json',
  dotenv: true, 
  dotenvViariable: 'GUN_NODE_RECALL'
}
```

Alternatively, you could pass the session data returned by `let recall = await Gun.recall(user.recall() [, opts])` to another storage service.

### `let recall = await Gun.recall(user.recall() [, opts])`
Creates or modifies session storage files given the optional `opts` object and returns a gun `user.recall` object that can be passed into gun to reauthenticate the stored user using `gun.user().auth(recall)`.

### `let revoke = await Gun.revoke(recall [, opts])`
Removes any files created or modified and returns the user's public key as `revoke`. This can later be used to remove the user from the graph with `user.get(revoke).put(null)`. 

Be careful if using `.env` for storage with `opts.dotenv = true`; it will be removed too. This will be corrected in a later version.

```js
let revoke = await Gun.revoke(recall, opts) // return the user's pub key
user.get(revoke).put(null) // delete the user
```