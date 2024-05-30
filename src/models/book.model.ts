import { z } from "zod";

const Book = z.object({
   title:z.string(),
   author:z.string(),
   publishedDate:z.string().date(),
   price:z.number(),
   sellerId:z.number()
});

export default Book;