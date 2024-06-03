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

// const mongoose = require('mongoose')

// const dbConnect=()=>{
//     mongoose.connect(process.env.dbConnect, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connected to MongoDB Atlas'))
//     .catch(err => console.error('Error connecting to MongoDB Atlas', err));
  
// }

// module.exports = dbConnect;


// // MongoDB Atlas connection string
// const uri = 'your_mongodb_atlas_connection_string';

// // Connect to MongoDB Atlas
// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB Atlas'))
//   .catch(err => console.error('Error connecting to MongoDB Atlas', err));
