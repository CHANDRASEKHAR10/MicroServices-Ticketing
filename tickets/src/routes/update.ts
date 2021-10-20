import { currentUser, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@chantickets/common';
import express, { Request, Response, NextFunction} from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.put('/api/tickets/:id',
    currentUser,
    requireAuth,
[
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({gt: 0}).withMessage('Price must be greater than 0')
],
    validateRequest,
async (req: Request,res: Response,next: NextFunction) =>{
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket){
        next(new NotFoundError());
    }

    if(ticket!.userId !== req.currentUser!.id){
        next(new NotAuthorizedError());
    }

    ticket!.set({
        title: req.body.title,
        price: req.body.price
    });

    await ticket!.save();

    res.send(ticket);
});

export { router as updateTicketRouter};