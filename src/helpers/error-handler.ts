import * as Sentry from '@sentry/node';
import { HttpError } from 'http-errors';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV || 'development' });
}

export function withExceptionHandler(fn: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await fn(req, res);
    } catch (ex) {
      if (ex instanceof HttpError) {
        const { statusCode, message } = ex;

        res.status(statusCode).json({ message });

        return;
      }

      Sentry.captureException(ex);

      res.status(500).json({ message: ex.message });
    }
  };
}
