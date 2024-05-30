import { Request, Response, NextFunction } from "express";
import fs from "fs";
import csvParser from "csv-parser";
import prisma from "../utils/client";

export const allBooks = async (req: Request, res: Response) => {
    try {
        const books = await prisma.book.findMany({});
        res.status(200).json({ message: "All books fetched successfully", data: books });
    }
    catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const allSellerBooks = async (req: Request, res: Response) => {
    try {
        const sellerId: number = req.body.sellerId;
        const books = await prisma.book.findMany({
            where: {
                sellerId: sellerId
            }
        });
        res.status(200).json({ message: "All books fetched successfully", data: books });
    }
    catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }

};

export const singleBook = async (req: Request, res: Response) => {
    try {
        const bookId: number = parseInt(req.params.bookId);
        const sellerId: number = req.body.sellerId;
        if (!sellerId) {
            return res.status(404).json({ message: "Provide seller id   " });
        }
        const book = await prisma.book.findUnique({
            where: {
                id: bookId
            }
        });
        if (book?.sellerId != sellerId) {
            return res.status(403).json({ message: "No access to other seller books" });
        }
        res.status(200).json({ message: "Book data fetched successfully", data: book });
    }
    catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const uploadBooks = async (req: Request, res: Response) => {
    const bookData: any[] = [];
    if (!req.file) {
        res.status(400).json({ error: "Missing file" });
    }
    try {
        const sellerId: number = parseInt(req.body.sellerId);
        const path: string = req.file?.path!;
        if (!sellerId) {
            return res.status(404).json({ message: "Provide seller id" });
        }
        console.log(req.file)
        fs.createReadStream(path)
            .pipe(csvParser())
            .on("data", (data) => {
                bookData.push(data);
            })
            .on("end", async () => {
                try {
                    console.log(bookData);
                    const books = await prisma.book.createMany({
                        data: bookData.map((book) => ({
                            title: book.title,
                            author: book.author,
                            publishedDate: new Date(book.publishedDate),
                            price: book.price,
                            sellerId: sellerId, // Set the sellerId for each book
                        })),
                        skipDuplicates: true
                    });
                    res.status(200).json({ message: "Book data update successfully", data: books });
                }
                catch (error: any) {
                    console.log(error);
                    res.status(500).json({ error: error.message });
                }
            });

    }
    catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const updateBook = async (req: Request, res: Response) => {
    try {
        const bookId: number = parseInt(req.params.bookId);
        const sellerId: number = req.body.sellerId;
        if (!sellerId) {
            return res.status(404).json({ message: "Provide seller id" });
        }
        const book = await prisma.book.findFirst({
            where: {
                id: bookId
            }
        });
        if (book?.sellerId != sellerId) {
            return res.status(403).json({ message: "No access to other seller books" });
        }
        const updatedBook = await prisma.book.update({
            where: {
                id: bookId
            },
            data: {
                title: req.body.title,
                author: req.body.author,
                price: req.body.price,
                publishedDate: new Date(req.body.publishedDate || book.publishedDate),
                sellerId: sellerId
            }
        });
        res.status(200).json({ message: "Book updated successfully", date: updatedBook });

    }
    catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteBook = async (req: Request, res: Response) => {
    try {
        const bookId: number = parseInt(req.params.bookId);
        const sellerId: number = req.body.sellerId;
        if (!bookId) {
            return res.status(404).json({ message: "Provide book id" });
        }
        if (!sellerId) {
            return res.status(404).json({ message: "Provide seller id" });
        }
        const book = await prisma.book.findFirst({
            where: {
                id: bookId
            }
        });
        if (book?.sellerId != sellerId) {
            return res.status(403).json({ message: "No access to other seller books" });
        }
        const deletedBook = await prisma.book.delete({
            where: {
                id: bookId
            }
        });
        res.status(200).json({ message: "Book deleted successfully", date: deletedBook });

    }
    catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}; 