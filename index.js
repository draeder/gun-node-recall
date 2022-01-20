const env = require('dotenv').config()
const fs = require('fs')
let Gun = require('gun')

Gun.chain.recall = async function(opts, cb) {
  let gun = this

  Gun.chain.recall.revoke = async (opts, cb) => {
    if(gun.user().is){
      gun.user().leave()
      await fs.promises.unlink(opts.filename).catch(err => {
        cb({code: 500, text: `Server error. Could not remove ${opts.filename}`})
      })
      cb({code: 200, text: `User logged out and ${opts.filename} removed.`})
    }
  }

  if(opts && opts.filename){
    gun.on('auth', async (ack) => {
      await fs.promises.writeFile(opts.filename, JSON.stringify(ack.sea) , { flag: 'w' }).catch(err => { console.log(err) })
      if(gun.user().is){
        cb(ack)
      }
    })
    let found = JSON.parse(await fs.promises.readFile(opts.filename).catch(err => false))
    if(found) return found
  } else {
    return gun
  }
}




