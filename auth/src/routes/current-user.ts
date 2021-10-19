import express, { Request, Response, NextFunction } from 'express';
import { currentUser } from '@chantickets/common';
import { requireAuth } from '@chantickets/common';

const router = express.Router();

router.get('/api/users/currentuser',currentUser,requireAuth,(req: Request,res: Response)=>{
    res.send({currentUser: req.currentUser || null});
    
});

export { router as currentUserRouter };