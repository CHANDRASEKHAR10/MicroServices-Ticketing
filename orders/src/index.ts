import express, { Request, Response, NextFunction } from 'express';
import { errorHandler, NotFoundError } from '@chantickets/common';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { getAllOrdersRouter } from './routes/all';
import { deleteOrderRouter } from './routes/delete';
import { showOrderRouter } from './routes/show';
import { newOrderRouter } from './routes/new';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: true
}));

console.log('Before orders routes');

app.use(getAllOrdersRouter);
app.use(showOrderRouter);
app.use(newOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async (request: Request,res: Response,next: NextFunction) =>{
    next(new NotFoundError());
});

app.use(errorHandler);

const start = async () =>{
    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY not defined');
    }

    try{
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URL!);
        natsWrapper.client.on('close', () =>{
            console.log('NATS closing');
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();

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