import { z } from "zod";

const Seller = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string()
});

export default Seller;