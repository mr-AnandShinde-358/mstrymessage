import {z} from 'zod'

export const signIn = z.object({
    identifier:z.string(),
    password:z.string()
})