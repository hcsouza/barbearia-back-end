import 'reflect-metadata';
import 'dotenv/config';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import routes from './routes';

import { errors } from 'celebrate';

import uplodConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import '@shared/infra/typeorm';
import '@shared/container';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uplodConfig.uploadsFolder));
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response:Response, next:NextFunction) => {
  if(err instanceof AppError){
    return  response
              .status(err.statusCode)
              .json({
                status: 'error',
                message: err.message,
               });
  }

  console.error(err);
  return response
          .status(500)
          .json({
            status: 'error',
            message: 'Internal Server Error',
          });
});

app.listen(3333, () => {
    console.log("Server started on port 3333.")
});
