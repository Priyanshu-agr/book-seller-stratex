import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

const validateRequestBody = (schema:ZodTypeAny) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.body);
            next();
        }
        catch (error: any) {
            console.log(error);
             res.status(400).json({ "error": error.message });
        }
    }
};

export default validateRequestBody;