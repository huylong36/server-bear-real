import express from 'express' ;
const cors = require('cors') ;
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const argon2 = require('argon2')
const bodyParser = require('body-parser')
import { webRouters } from './routers/index';
import http, { Server } from "http";
import cookieParser from 'cookie-parser';
import { errorHandler, notFoundHandler } from './errorHandler/errorHandle';
const app = express();
const PORT = process.env.port || 5000;
dotenv.config()
const URl_  = 'mongodb+srv://admin:admin@cluster0.snb5pwp.mongodb.net/?retryWrites=true&w=majority'
const PREFIX_API = "/api"


class App {
    public app: express.Application;
    public server: Server;
    public port: string | number;
    private config() {
        const NODE_ENV = process.env.NODE_ENV || 'development';
        // this.app.use(helmet());
        this.app.use(cookieParser());
        this.app.use(cors({
            origin: NODE_ENV === 'production' ? (process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.split(',') : true) : true,
            credentials: true,
            allowedHeaders: 'X-PINGOTHER, Content-Type, Authorization, X-Forwarded-For',
            methods: 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS',
            optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
        }));
        this.app.use(express.json({ limit: "50mb" }));
        this.app.use(express.urlencoded({ extended: true, limit: "50mb" }));
       
    }
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.port = process.env.PORT || 3001;
        this.config();
        this.useAPI();
    }
    run() {
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
        connectDB();
    }
    private useAPI() {
        // Web
        this.app.use(PREFIX_API, webRouters);
        this.app.use(errorHandler);
        this.app.use(notFoundHandler);
    }
}

app.use(cors());
 app.use(bodyParser.json()) // for parsing application/json
 app.use(bodyParser.urlencoded({ extended: true }))

app.listen(PORT,()=>{
    console.log(`server is running port  ${PORT}`);
})

export { App };