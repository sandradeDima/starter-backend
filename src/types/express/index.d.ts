import { File as MulterFile } from 'multer';

declare global {
    namespace Express {
        interface Request {
            files?: MulterFile[] | { [fieldname: string]: MulterFile[] };
        }
    }
}

export {};
