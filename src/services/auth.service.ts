import bcrypt from 'bcrypt';
import configure from 'config';
import jwt from 'jsonwebtoken';
import DB from '@databases';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { config } from '@utils/config';
const salt = 10;
const sixty = 60;

class AuthService {
  public users = DB.Users;

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) {
      throw new HttpException(config.HTTP_BAD_REQUEST, 'This not userData');
    }

    const findUser: User = await this.users.findOne({ where: { email: userData.email } });
    if (findUser) {
      throw new HttpException(config.HTTP_CONFLICTED_REQ, `You're email ${userData.email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(userData.password, salt);
    return this.users.create({ ...userData, password: hashedPassword });
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; findUser: User }> {
    if (isEmpty(userData)) {
      throw new HttpException(config.HTTP_BAD_REQUEST, "You're not userData");
    }

    const findUser: User = await this.users.findOne({ where: { email: userData.email } });
    if (!findUser) {
      throw new HttpException(config.HTTP_CONFLICTED_REQ, `You're email ${userData.email} not found`);
    }

    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) {
      throw new HttpException(config.HTTP_CONFLICTED_REQ, "You're password not matching");
    }

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) {
      throw new HttpException(config.HTTP_BAD_REQUEST, "You're not userData");
    }

    const findUser: User = await this.users.findOne({ where: { email: userData.email, password: userData.password } });
    if (!findUser) {
      throw new HttpException(config.HTTP_CONFLICTED_REQ, "You're not user");
    }

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = configure.get('secretKey');
    const expiresIn: number = sixty * sixty;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;