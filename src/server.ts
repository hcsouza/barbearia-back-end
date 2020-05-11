import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import routes from './routes';
import uplodConfig from './config/upload';
import cors from 'cors';

import './database';
import AppError from './errors/AppError';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uplodConfig.directory));
app.use(routes);

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
