import { Request, Response, NextFunction } from 'express';
interface UserPayLoad {
    id: string;
    email: string;
}
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayLoad;
        }
    }
}
export declare const currentUser: (req: Request, res: Response, next: NextFunction) => void;
export {};
