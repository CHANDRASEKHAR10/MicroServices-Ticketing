import { currentUser, NotAuthorizedError, NotFoundError, OrdersStatus, requireAuth } from '@chantickets/common';
import express, { Request, Response, NextFunction} from 'express';
import { Order } from '../models/orders';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:id', 
    currentUser,
    requireAuth,
async (req: Request,res: Response,next: NextFunction) =>{
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('ticket');

    if(!order){
        return next(new NotFoundError());
    }

    if(order.userId !== req.currentUser!.id){
        return next(new NotAuthorizedError());
    }

    order.status = OrdersStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    });

    res.status(204).send(order);
});

export { router as deleteOrderRouter};