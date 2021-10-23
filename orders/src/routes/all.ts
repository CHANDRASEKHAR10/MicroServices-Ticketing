import { currentUser, requireAuth } from '@chantickets/common';
import express, { Request, Response, NextFunction} from 'express';
import { Order } from '../models/orders';

const router = express.Router();

router.get('/api/orders', 
    currentUser,
    requireAuth,
async (req: Request,res: Response) =>{
    const orders = await Order.find({
        userId: req.currentUser!.id
    }).populate('ticket');
    res.send(orders);
});

export { router as getAllOrdersRouter};