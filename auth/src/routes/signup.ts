import express, {NextFunction, Request, Response} from 'express';
import {body} from 'express-validator';
import { BadRequestError } from '@chantickets/common';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { validateRequest } from '@chantickets/common';

const router = express.Router();

router.post('/api/users/signup',
 [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min:4, max:20}).withMessage('Password length must be between 4 and 20 characters')
 ],
 validateRequest,
 async (req: Request,res: Response, next: NextFunction) => {

    const { email, password } = req.body;

    const existingUser = await User.findOne({email});

    if(existingUser){
        next(new BadRequestError());
    }

    const user = User.build({email, password});
    await user.save();

    const userJWT = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY!
    );

    req.session = {
        jwt: userJWT
    };

    return res.status(201).send(user);
});

export { router as signupRouter };