import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== 'Bearer your_access_token') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  }
}
