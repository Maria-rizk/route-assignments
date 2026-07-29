import {z} from "zod"
export const SayHi = z.strictObject({
    name:z.string().min(2)
})