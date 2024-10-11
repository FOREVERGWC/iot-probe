// // // import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
// // // import { fileRouter } from "@/server/file";
// // // import { createContext } from "@/server/context";
// // // import { createRouter } from 'next-connect'
// // // import {NextApiRequest, NextApiResponse} from "next";
// // // import fs from "fs";
// // // import multer from 'multer';
// // // const basePath = process.env.UPLOAD_PATH || './uploads';
// // //
// // // // const upload = multer({
// // // //     storage: multer.diskStorage({
// // // //         destination: (req: NextApiRequest, file: any, cb: any) => {
// // // //             if (!fs.existsSync(basePath)) {
// // // //                 fs.mkdirSync(basePath, { recursive: true });
// // // //             }
// // // //             cb(null, basePath);
// // // //         },
// // // //         filename: (req: NextApiRequest, file: any, cb: any) => {
// // // //             cb(null, `${Date.now()}-${file.originalname}`);
// // // //         },
// // // //     }),
// // // // });
// // //
// // // const router = createRouter<NextApiRequest, NextApiResponse>();
// // // // router.use(upload.single('file'));
// // //
// // // const handler = (req: Request) => {
// // //     return router.post((req: NextApiRequest, res: NextApiResponse) => {
// // //         const file = req.file; // 通过 req.file 访问上传的文件
// // //         const fields = req.body; // 通过 req.body 访问表单的其他字段
// // //
// // //         if (!file) {
// // //             return res.status(400).json({ success: false, message: 'No file uploaded' });
// // //         }
// // //
// // //         console.log('Uploaded file:', file);
// // //         console.log('Form fields:', fields);
// // //
// // //         res.status(200).json({
// // //             success: true,
// // //             file: {
// // //                 originalname: file.originalname,
// // //                 filename: file.filename,
// // //                 path: file.path,
// // //             },
// // //             fields, // 返回其他表单字段
// // //         });
// // //     })
// // // }
// // //
// // // export { handler as GET, handler as POST };
// // //
// // // export const runtime = "nodejs";
// // // pages/api/upload.js
// // // import formidable from 'formidable';
// // import fs from 'fs';
// // import path from 'path';
// // import {NextApiRequest, NextApiResponse} from "next";
// // import {createRouter} from "next-connect";
// // import {normalStorage} from "@/utils/file";
// //
// //
// // // export const config = {
// // //     api: {
// // //         bodyParser: false,
// // //     },
// // // };
// //
// // // const router = createRouter<NextApiRequest, NextApiResponse>();
// // // router.use(normalStorage.single('file'));
// //
// // const handler = (req: NextApiRequest, res: NextApiResponse) => {
// //     console.log(req)
// //     res.statusCode = 200;
// //     res.json({ message: "Request handled successfully!" });
// //     // return res.status(200).json({ message: "Request handled successfully!" });
// // }
// //
// // export { handler as GET, handler as POST };
// import { mkdir, writeFile } from 'fs/promises';
// import { NextRequest, NextResponse } from 'next/server';
// import { join } from 'path';
//
// export async function POST(req: NextRequest) {
//     const data = await req.formData();
//     const file: File | null = data.get('file') as unknown as File;
//
//     if (!file) {
//         return NextResponse.json({ success: false });
//     }
//
//     // Converting web PDF to bytes that Node.js can understand
//     const bytes = await file.arrayBuffer();
//     // const buffer = Buffer.from(bytes);
//     //
//     // const uploadsDir = join(process.cwd(), 'public/uploads');
//     // const path = join(uploadsDir, file.name);
//
//     // Sicherstellen, dass das Verzeichnis existiert
//     // await mkdir(uploadsDir, { recursive: true });
//
//     // await writeFile(path, buffer);
//
//     try {
//         // const pdfData = await pdf(buffer);
//         // console.log('data.numpages: ' + pdfData.numpages);
//         // console.log('data.info: ', pdfData.info);
//         // console.log('data.text: ', pdfData.text);
//         //
//         // console.log(`File uploaded to ${path}`);
//
//         // if (pdfData.text.trim().length > 0) {
//         //     return NextResponse.json({ success: true, text: pdfData.text });
//         // }
//         return NextResponse.json({
//             success: false,
//             message: 'Kein Text in der PDF gefunden.',
//         });
//     } catch (error) {
//         console.error('Fehler beim Parsen der PDF:', error);
//         return NextResponse.json({
//             success: false,
//             message: 'Fehler beim Parsen der PDF',
//         });
//     }
// }