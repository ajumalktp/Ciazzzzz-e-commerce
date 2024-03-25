const mongoose = require('mongoose')

const dbConnect=()=>{
    mongoose.set('strictQuery',true)
    mongoose.connect(process.env.dbConnect)
    .then(()=>{
        console.log('server connected to the database!');
    })
    .catch(err=>{
        console.log('error'+err)
    })
}

module.exports = dbConnect;