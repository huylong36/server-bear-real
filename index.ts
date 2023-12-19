import express from 'express' ;
import cors  from 'cors' ;
import mongoose  from 'mongoose';
import dotenv  from'dotenv'
const argon2 = require('argon2')
const bodyParser = require('body-parser')
import {webRouter } from './routers/index';
import http, { Server } from "http";
import cookieParser from 'cookie-parser';
import { errorHandler, notFoundHandler } from './errorHandler/errorHandle';
const app = express();

dotenv.config()
const URl_  = 'mongodb+srv://admin:admin@cluster0.snb5pwp.mongodb.net/?retryWrites=true&w=majority'
const PREFIX_API = "/api"


const PORT = process.env.port || 5000;
class App {
    public app: express.Application;
    public port: string | number;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3001;

        this.config();
        this.useAPI();
    }
    run() {
        this.app.listen(this.port, () => {
            console.log(`server running port ${this.port} `);
        })

        const connectDB = async () =>{
            try {
                mongoose.set('strictQuery', false); 
                await mongoose.connect(URl_ ,{
                    
                   
                });
            } catch (error) {
                console.log('error' ,error);
                process.exit(1)
            }
        } 
        connectDB();

    }

    private config() {
        const NODE_ENV = process.env.NODE_ENV || 'development';
        this.app.use(cookieParser());
        this.app.use(cors({
            origin: process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.split(',') : true,
            credentials: true,
            allowedHeaders: 'X-PINGOTHER, Content-Type, Authorization, X-Forwarded-For, x-requested-with, x-access-token',
            methods: 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS',
            optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
        }));
        this.app.use(express.json({ limit: "50mb" }));
        this.app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    }
    private useAPI() {
        this.app.use(PREFIX_API, webRouter);//router user for app
        this.app.use(errorHandler);
        this.app.use(notFoundHandler)
    }
}

const myApp = new App();
myApp.run();

export { App };