import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import http from 'node:http';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import { createHandler } from 'graphql-http/lib/use/express';

import {
  chatRouter,
  realTimeGateway,
  commentRouter,
  postRouter,
  authRouter,
  userRouter,
  notificationRouter,
  schema,
} from './modules/index.js';
import { globalErrorHandler } from './middleware/index.js';
import { authentication } from './middleware/authentication.middleware.js';
import { storageService } from './common/services/storage.service.js';

const streamToResponse = promisify(pipeline);

export function createApp(): { app: express.Express; httpServer: http.Server } {
  const app: express.Express = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

 
  app.use(
    '/auth',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
  });

  app.all(
    '/graphql',
    authentication(),
    createHandler({
      schema,
      context: (req) => ({
        user: req.raw.user,
        decoded: req.raw.decoded,
      }),
    })
  );

  app.use('/auth', authRouter);
  app.use('/post', postRouter);
  app.use('/comment', commentRouter);
  app.use('/user', userRouter);
  app.use('/notification', notificationRouter);
  app.use('/chat', chatRouter);


  app.get(
    '/uploads/*path',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        const { download, fileName } = req.query as { download?: string; fileName?: string };
        const { path } = req.params as unknown as { path: string[] };
        const key = path.join('/');

        const { Body, ContentType } = await storageService.getAsset({ Key: key });

        res.setHeader('Content-Type', ContentType || 'application/octet-stream');
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');

        if (download === 'true') {
          res.setHeader('Content-Disposition', `attachment; filename="${fileName || key.split('/').pop()}"`);
        }

        await streamToResponse(Body as NodeJS.ReadableStream, res);
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    '/pre-signed/*path',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        const { download, fileName } = req.query as { download?: string; fileName?: string };
        const { path } = req.params as unknown as { path: string[] };
        const key = path.join('/');

        const url = await storageService.createPreSignedFetchLink({ key, download, fileName });
        res.status(200).json({ url });
      } catch (error) {
        next(error);
      }
    }
  );

  app.get('/', (_req, res) => {
    res.status(200).json({ message: 'Social media app API' });
  });

  app.use((req, res) => {
    res.status(404).json({ message: 'Invalid application routing' });
  });

  app.use(globalErrorHandler);

  const httpServer = http.createServer(app);

  return { app, httpServer };
}
