const crypto = require('crypto')
const Gun = require('gun')
require('./index')

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

  console.log(recall)

  if(!recall){ 
    user.create(username, password).auth() 
  } else {
    user.auth(recall)
  }

  gun.recall.revoke(opts, ack => {
    console.log(ack)
  })

})()



