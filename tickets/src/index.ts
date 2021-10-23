import express, { Request, Response, NextFunction } from 'express';
import { errorHandler, NotFoundError } from '@chantickets/common';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { createTickerRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { getAllTicketsRouter } from './routes/alltickets';
import { updateTicketRouter } from './routes/update';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: true
}));

console.log('Before create ticket route');

app.use(createTickerRouter);
app.use(showTicketRouter);
app.use(getAllTicketsRouter);
app.use(updateTicketRouter);

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

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();

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