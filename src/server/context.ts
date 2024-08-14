import { inferAsyncReturnType } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function createContext({ req }: FetchCreateContextFnOptions) {
    let id: number | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
            id = decoded.id;
        } catch (error) {
            console.error("无效的 token", error);
        }
    }

    return {
        req,
        id
    };
}

export type Context = inferAsyncReturnType<typeof createContext>;
