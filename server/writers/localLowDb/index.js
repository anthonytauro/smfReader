
const low = require('lowdb')
const fileAsync = require('lowdb/lib/storages/file-async')
//const FileAsync = require('lowdb/adapters/FileAsync')

//const adapter = new FileAsync('db.json')
//const db = low(adapter)

// Start database using file-async storage
const db = low('db.json', {
    storage: fileAsync
  })
  

db.defaults({logs:[]}).write()

// Method to read by log Id
const getLogById = (id) => db.get('logs').find({ id: id }).value()

// Method to write log and return Id
const writeLog = (log) =>   
            db.get('logs').push(log).last().assign({ id: Date.now() }).write().then(log => log.id)

//let retVal = writeLog({title: 'writing tweet to db', category:'education'})
//let retVal = writeLog({ value: 23, quantity:2, price: 11.5 })

module.exports = {
    getLogById,
    writeLog
}