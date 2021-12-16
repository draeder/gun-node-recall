require('./index')
const Gun = require('gun')
const crypto = require('crypto')

const gun = new Gun()

let username = crypto.randomBytes(20).toString()
let password = crypto.randomBytes(20).toString()

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
  //let cleanUp = await Gun.revoke(recall, opts)
  //console.log(cleanUp)

})

gun.on('auth', ack => console.log('Authentication was successful!'))
