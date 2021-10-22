import express, { Request, Response, NextFunction } from "express";
import { requireAuth, validateRequest, currentUser } from "@chantickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";

const router = express.Router();

const dbug = (req: Request,res: Response,next: NextFunction) =>{
    console.log('inside dbug');
    next();
};

router.post('/api/tickets',
    currentUser,
    requireAuth,
[
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({gt: 0}).withMessage('Price must be greater than 0')
],
    validateRequest,
async (req: Request,res: Response) =>{
    console.log('Inside new function');

    const { title, price } = req.body;

    console.log('Ticket is ',{title, price});

    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    });

    await ticket.save();
    res.status(201).send(ticket);
});

export {router as createTickerRouter};