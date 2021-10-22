import { currentUser, NotAuthorizedError, NotFoundError, requireAuth } from '@chantickets/common';
import express, { Request, Response, NextFunction} from 'express';
import { Order } from '../models/orders';

const router = express.Router();

router.get('/api/orders/:id', 
    currentUser,
    requireAuth,
async (req: Request,res: Response,next: NextFunction) =>{
    const order = await Order.findById(req.params.id).populate('ticket');

    if(!order){
        return next(new NotFoundError());
    }

    if(order.userId!==req.currentUser!.id){
        return next(new NotAuthorizedError());
    }

    res.send(order);

});

export { router as showOrderRouter};