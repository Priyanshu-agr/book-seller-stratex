import jwt from "jsonwebtoken";
import "dotenv/config";

const generateAccessToken = (id: number) => {
    return jwt.sign({id:id.toString()}, process.env.TOKEN_SECRET||'password', { expiresIn: "2h" });
};

export default generateAccessToken;