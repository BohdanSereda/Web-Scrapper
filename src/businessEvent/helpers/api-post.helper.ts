import { ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBodyOptions } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileFilter } from '../dto/custom-types';

export const parseFile: ParseFilePipe = new ParseFilePipe({
  validators: [new FileTypeValidator({ fileType: fileFilter })],
});

export const fileInterceptorConfig: MulterOptions = {
  storage: diskStorage({
    destination: './images',
    filename: (req, file, cb) => {
      const fileName: string = file.originalname;
      cb(null, fileName);
    },
  }),
};

export const apiBodySchema: ApiBodyOptions = {
  schema: {
    type: 'object',
    properties: {
      name: {
        example: 'party',
        type: 'string',
        description: 'business event name',
      },
      event_start: {
        example: '13.09.2022:9:00',
        type: 'string',
        description: 'business event start',
      },
      event_end: {
        example: '13.09.2022:14:00',
        type: 'string',
        description: 'business event end',
      },
      description: {
        example: 'very cool party',
        type: 'string',
        description: 'business event description',
      },
      image: {
        type: 'string',
        format: 'binary',
        description: 'business event image',
      },
      features: {
        example: 'no alcohol',
        type: 'string',
        description: 'business event features',
      },
      frequency: {
        example: 'daily',
        type: 'FrequencyType',
        description: 'business event frequency',
      },
      businessId: {
        example: 14,
        type: 'number',
        description: 'business id',
      },
    },
  },
};
