import { Request, Response } from "express";
import prisma from "../utils/client";
import bcrypt from "bcrypt";
import "dotenv/config";
import generateAccessToken from "../utils/jwt";

const saltRounds: number = parseInt(process.env.SALT_ROUND || '10');

export const userRegister = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const hash: string = await bcrypt.hash(password, saltRounds);
        const seller = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hash
            }
        });
        res.status(200).json({ message: "User registered successfully", data: seller });
    }
    catch (error: any) {
        console.log(error);
        res.status(500).json({ "error": error.message });
    }
};

export const userLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(404).json({ message: "No user with given email exits" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = generateAccessToken(user.id);
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

export const allBooks = async (req: Request, res: Response) => {

}