import express, { Request, Response, NextFunction } from 'express';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from '@chantickets/common';
import { NotFoundError } from '@chantickets/common';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: true
}));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

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