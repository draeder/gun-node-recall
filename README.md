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
onst crypto = require('crypto')
const Gun = require('gun')

const gun = new Gun()
let user = gun.user()

let username = crypto.randomBytes(20).toString()
let password = crypto.randomBytes(20).toString()

let opts = {
  filename: 'sessionStorage.json'
}

;(async ()=> {

  let recall = await gun.recall(opts, ack => { 
    console.log('Recall authenticated!')
  })

  if(!recall){ 
    user.create(username, password).auth() 
  } else {
    user.auth(recall)
  }

  gun.recall.revoke(opts, ack => {
    console.log(ack)
  })

})()
```

## Parameters 
### `[opts]`
If no options are defined, session data is only stored in memory. To store session data between server restarts, specify the following options.

```js
let opts = {
  filename: 'sessionStorage.json',
}
```

## API
### `await gun.recall(opts, [, callback ])`
Creates a session storage file with opts `filename` parameter if it doesn't already exist. Then waits for user authentication and returns the Gun SEA pair once authentication is successful.

If the session storage file already exists, returns the Gun SEA pair.

```js
let recall = await gun.recall(opts, ack => { 
  console.log('Recall authenticated!')
})
```

### `await gun.recall.revoke(opts [, callback ])`
Removes any session storage file created. If this instance is restarted, the session will not be restored. The callback will return the status code and status text.

This method is ignored if no file exists when it is called.

```js
let revoke = await gun.recall.revoke(opts, ack => {
  console.log(ack)
})
```