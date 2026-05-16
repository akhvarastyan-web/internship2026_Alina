import { diskStorage } from 'multer';
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req: any, file: any, callback: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      callback(null, true);
    } else {
      callback(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
};
