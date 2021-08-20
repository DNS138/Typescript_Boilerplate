import { NextFunction, Request, Response } from 'express';
import { config } from '@utils/config';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.sendStatus(config.HTTP_SUCCESS);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
