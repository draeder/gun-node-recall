require('./index')
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
