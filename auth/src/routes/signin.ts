import express, {Request, Response, NextFunction} from 'express';
import { body } from 'express-validator';
import { BadRequestError } from '@chantickets/common';
import { validateRequest } from '@chantickets/common';
import { User } from '../models/user';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin',
[
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().notEmpty().withMessage('Password must not be empty')
],
validateRequest,
async (req: Request,res: Response,next: NextFunction)=>{
    console.log('Error not present');
    const {email, password} = req.body;

    const existingUser = await User.findOne({email});

    if(!existingUser){
        return next(new BadRequestError());
    }

    const passwordsMatch = await Password.compare(
        existingUser!.password, 
        password);

    if(!passwordsMatch){
        return next(new BadRequestError());
    }

    const userJWT = jwt.sign({
        id: existingUser!.id,
        email: existingUser!.email
    }, process.env.JWT_KEY!
    );

    req.session = {
        jwt: userJWT
    };

    res.status(200).send(existingUser);
});

export { router as signinRouter };