import { Request, Response, NextFunction } from "express";
import prisma from "../utils/client";
import bcrypt from "bcrypt";
import "dotenv/config";
import generateAccessToken from "../utils/jwt";

const saltRounds: number = parseInt(process.env.SALT_ROUND || '10');

export const sellerRegister = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const hash: string = await bcrypt.hash(password, saltRounds);
        const seller = await prisma.seller.create({
            data: {
                name: name,
                email: email,
                password: hash  
            }
        });
        res.status(200).json({ message: "Seller registered successfully", data: seller });
    }
    catch (error: any) {
        console.log(error);
        res.status(500).json({ "error": error.message });
    }
};

export const sellerLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const seller = await prisma.seller.findUnique({
            where: {
                email: email
            }
        });
        if (!seller) {
            return res.status(404).json({ message: "No seller with given email exits" });
        }
        const match = await bcrypt.compare(password, seller.password);
        if (match) {
            const token = generateAccessToken(seller.id);
            res.status(200).json({ message: "Login successful", data: token });
        }
        else {
            res.status(401).json({ message: "Authentication failed: Wrong password" });
        }

    }
    catch (error: any) {
        console.log(error);
        res.status(500).json({ "error": error.message });
    }
};   