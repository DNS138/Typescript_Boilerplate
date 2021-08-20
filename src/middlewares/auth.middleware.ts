import { NextFunction, Response } from 'express';
import configure from 'config';
import jwt from 'jsonwebtoken';
import DB from '@databases';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { config } from '@utils/config';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || req.header('Authorization').split('Bearer ')[1] || null;

    if (Authorization) {
      const secretKey: string = configure.get('secretKey');
      const verificationResponse = jwt.verify(Authorization, secretKey) as DataStoredInToken;
      const userId = verificationResponse.id;
      const findUser = await DB.Users.findByPk(userId);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(config.HTTP_UN_AUTHORIZED, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(config.HTTP_NOT_FOUND, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(config.HTTP_UN_AUTHORIZED, 'Wrong authentication token'));
  }
};

export default authMiddleware;
