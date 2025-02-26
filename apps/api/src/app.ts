import express, { Request, Response } from 'express';

const app = express();

app.get('/', (_req: Request, res: Response) => {
  res.send('Express + TypeScript Server for Judit');
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send();
});

export { app };
