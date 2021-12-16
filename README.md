# gun-node-recall
Preserve Gun DB service account sessions between server restarts. 

> Take care with this library that proper precautions are considered to secure the session data.

## Install
```js
npm i gun-node-recall
```

## Usage

### Example
```js
require('gun-node-recall')
const Gun = require('gun')

const gun = new Gun()

let username = Math.random().toString() // insecure username
let password = Math.random().toString() // insecure password

let user = gun.user()

user.create(username, password, async cb => {

  let opts = {
    filename: 'sessionStorage.json',
    dotenv: true,
    dotenvViariable: 'GUN_NODE_RECALL'
  }
  
  let recall = await Gun.recall(user.recall(), opts)
  gun.user().auth(recall)
  
  // Do this with caution if you depend on the files created
  let cleanUp = await Gun.revoke(recall, opts)
  console.log(cleanUp)

})

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

### `let cleanup = await Gun.revoke(recall [, opts])`
Removes any files created or modified. Be careful if using `.env` for storage with `opts.dotenv = true`; it will be removed too. This will be corrected in a later version.