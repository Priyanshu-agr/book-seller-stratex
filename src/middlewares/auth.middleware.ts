import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.header("Authorization") || '';
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Missign JWT token" });
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET || 'password', (err, id) => {
            if (err) {
                console.log(err);
                return res.status(403).json({error:"Invaid JWT"});
            }
            next();
        });

    }
    catch (error: any) {
        res.status(401).json({ error: error.message });
    }
};

export default verifyToken;