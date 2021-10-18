import express, { Request, Response, NextFunction } from 'express';
import { errorHandler, NotFoundError } from '@chantickets/common';
import { currentUser } from '@chantickets/common';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { createTickerRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: true
}));

app.use(currentUser);

app.use(createTickerRouter);

app.all('*', async (request: Request,res: Response,next: NextFunction) =>{
    next(new NotFoundError());
});

app.use(errorHandler);

const start = async () =>{
    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY not defined');
    }

    try{
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('connected to mongo db');
        
    }catch(err){
        console.error(err);
    }
};

app.listen(3000, ()=>{
    console.log('Listening on Port 3000');
});

start();