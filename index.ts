const express = require('express') ;
const cors = require('cors') ;
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const argon2 = require('argon2')
const bodyParser = require('body-parser')

// const authRouter = require('./routers/auth.js');
const app = express();
const PORT = process.env.port || 5000;
dotenv.config()
const URl_  = 'mongodb+srv://dohuylong:Dohuylong2000@cluster0.ek1is.mongodb.net/technology?retryWrites=true&w=majority'


const connectDB = async () =>{
    try {
        await mongoose.connect(URl_ ,{
           
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.log('error' ,error);
        process.exit(1)
    }
} 
// connectDB();
app.use(cors());
 app.use(bodyParser.json()) // for parsing application/json
 app.use(bodyParser.urlencoded({ extended: true }))

app.listen(PORT,()=>{
    console.log(`server is running port  ${PORT}`);
})
// app.use('/auth' ,authRouter)

app.use(express.json())

