// @ts-ignore
import multer from 'multer';
import { NextApiRequest } from "next";
import fs from "fs";
const UPLOAD_PATH = process.env.UPLOAD_PATH || './uploads';

const normalStorage = multer.diskStorage({
    destination: (req: NextApiRequest, file: any, cb: any) => {
        if (!fs.existsSync(UPLOAD_PATH)) {
            fs.mkdirSync(UPLOAD_PATH, { recursive: true });
        }
        cb(null, UPLOAD_PATH);
    },
    filename: (req: NextApiRequest, file: any, cb: any) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});


export {
    normalStorage
}
