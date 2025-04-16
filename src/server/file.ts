// import multer from 'multer';
import { z } from 'zod'
import { procedure, router } from '@/server/trpc'
import { TRPCClientError } from '@trpc/client'
import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'

const basePath = process.env.UPLOAD_PATH || './uploads'

// const upload = multer({
//     storage: multer.diskStorage({
//         destination: (req: NextApiRequest, file: any, cb: any) => {
//             if (!fs.existsSync(basePath)) {
//                 fs.mkdirSync(basePath, { recursive: true });
//             }
//             cb(null, basePath);
//         },
//         filename: (req: NextApiRequest, file: any, cb: any) => {
//             cb(null, `${Date.now()}-${file.originalname}`);
//         },
//     }),
// });

export const fileRouter = router({
	upload: procedure.input(z.any()).mutation(async ({ input }) => {
		try {
			console.log(input)
			console.log('aaa')
			// const fileData = input.file;
			// // 在这个基础上返回文件名和文件路径
			// return await upload(fileData);
			return {
				msg: '上传成功！'
			}
		} catch (error) {
			debugger
			console.log(error)
			throw new TRPCClientError('上传失败！')
		}
	})
})

export type FileRouter = typeof fileRouter
