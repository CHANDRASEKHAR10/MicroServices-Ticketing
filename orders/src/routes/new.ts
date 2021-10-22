import express, { Request, Response, NextFunction} from 'express';
import { NotFoundError, requireAuth, validateRequest, OrdersStatus, BadRequestError, currentUser } from '@chantickets/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order } from '../models/orders';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW = 15*60;

router.post('/api/orders', 
    currentUser,
    requireAuth,
    [
    body('ticketId').not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId must not be empty'),
    ],
    validateRequest,
async (req: Request,res: Response,next: NextFunction) =>{
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if(!ticket){
        return next(new NotFoundError());
    }

    const isReserved = await ticket.isReserved();

    if(isReserved){
        return next(new BadRequestError());
    }
    
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW);

    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrdersStatus.Created,
        expiresAt:expiration,
        ticket
    });

    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    });

    res.status(201).send(order);

});

export { router as newOrderRouter};