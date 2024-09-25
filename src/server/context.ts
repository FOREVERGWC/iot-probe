import { inferAsyncReturnType } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import jwt from 'jsonwebtoken';
import prisma from "@/libs/db";

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function createContext({ req }: FetchCreateContextFnOptions) {
    let id: number = 0;
    let roleIdList: Array<number> = [];
    const authHeader = req.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
            id = decoded.id;
            const roleList = await prisma.user_role_link.findMany({
                where: { user_id: id }
            });
            roleIdList = roleList.map(item => item.role_id)
        } catch (error) {
            throw new Error("无效的 token");
        }
    }

    return {
        req,
        id,
        roleIdList
    };
}

export type Context = inferAsyncReturnType<typeof createContext>;
