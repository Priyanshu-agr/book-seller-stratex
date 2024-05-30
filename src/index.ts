import express, { Express } from "express";
import sellerRouter from "./routes/seller.route";
import bookRouter from "./routes/books.route";
import userRouter from "./routes/users.route"
import 'dotenv/config';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/healthcheck", (req, res) => {
    res.send("Server is up and running");
});

app.use("/user", userRouter);
app.use("/seller", sellerRouter);
app.use("/book", bookRouter);

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});