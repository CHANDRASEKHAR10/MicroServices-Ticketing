import { NotFoundError } from '@chantickets/common';
import express, { NextFunction, Request, Response} from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response,next: NextFunction)=>{
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket){
        next(new NotFoundError());
    }

    res.status(200).send(ticket);
});