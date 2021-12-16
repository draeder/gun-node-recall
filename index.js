const env = require('dotenv').config()
const fs = require('fs')
let gun = require('gun')

gun.recall = async function(recall, opts) { 
  let r = JSON.stringify(recall.is)
  let dotenvFilename = '.env'
  
  gun.revoke = async (recall, opts) => {
    recall = null
    if(opts && opts.filename)
    await fs.promises.unlink(opts.filename).catch(err => {})

    if(dotenvFilename)
    await fs.promises.unlink(dotenvFilename).catch(err => {})

    return "Removed files created by gun-node-recall"
  }
  

  if(opts && opts.filename){
    let found = await fs.promises.readFile(opts.filename).catch(err => false)
    if(!found) await fs.promises.writeFile(opts.filename, r , { flag: 'w' }).catch(err => {})
    else return JSON.parse(found)
  }

  if(opts && opts.dotenv === true){
    let envVar = opts.dotenvVariable = opts.dotenvVariable || 'GUN_NODE_RECALL'

    let envExists
    if(!env.error) {
      envExists = Object.keys(env.parsed).includes(envVar)
      if(envExists === true){
        return JSON.parse(process.env[envVar])
      }
    }

    let contents = await fs.promises.readFile(dotenvFilename).catch(err => false)

    if(contents === false && (envExists === false || !envExists)) {
      r = `${envVar}=${r}`
      insert()
    } 
    else if (envExists === false || !envExists) {
      r = `\n${envVar}=${r}`
      insert()
    } 
    else if (envExists === true && env.parsed[envVar] != r) {
      let data = await fs.promises.readFile(dotenvFilename)
      data = data.toString()
      let re = new RegExp('^.*' + data + '.*$', 'gm');
      let formatted = data.replace(re, `${envVar}=${r}`);
      await fs.promises.writeFile(dotenvFilename, formatted).catch(err => {throw err})
    }

    async function insert(){
      await fs.promises.appendFile(dotenvFilename, r ).catch(err => {throw err})
    }
  }

  return recall.is
}

module.exports = gun
