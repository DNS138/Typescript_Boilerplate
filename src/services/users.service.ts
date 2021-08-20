import bcrypt from 'bcrypt';
import DB from '@databases';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { config } from '@utils/config';
const salt = 10;
class UserService {
  public users = DB.Users;

  public async findAllUser(): Promise<User[]> {
    return this.users.findAll();
  }

  public async findUserById(userId: number): Promise<User> {
    if (isEmpty(userId)) {
      throw new HttpException(config.HTTP_BAD_REQUEST, "You're not userId");
    }

    const findUser: User = await this.users.findByPk(userId);
    if (!findUser) {
      throw new HttpException(config.HTTP_CONFLICTED_REQ, "You're not a user");
    }

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) {
      throw new HttpException(config.HTTP_BAD_REQUEST, "You're not userData");
    }

    const findUser: User = await this.users.findOne({ where: { email: userData.email } });
    if (findUser) {
      throw new HttpException(config.HTTP_CONFLICTED_REQ, `You're email ${userData.email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(userData.password, salt);
    return this.users.create({ ...userData, password: hashedPassword });
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) {
      throw new HttpException(config.HTTP_BAD_REQUEST, "You're not userData");
    }

    const findUser: User = await this.users.findByPk(userId);
    if (!findUser) {
      throw new HttpException(config.HTTP_CONFLICTED_REQ, "You're not user");
    }

    const hashedPassword = await bcrypt.hash(userData.password, salt);
    await this.users.update({ ...userData, password: hashedPassword }, { where: { id: userId } });

    return this.users.findByPk(userId);
    // return updateUser;

    // const updateUser: User = await this.users.findByPk(userId);
    // return updateUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    if (isEmpty(userId)) {
      throw new HttpException(config.HTTP_BAD_REQUEST, "You're not userId");
    }

    const findUser: User = await this.users.findByPk(userId);
    if (!findUser) {
      throw new HttpException(config.HTTP_CONFLICTED_REQ, "You're not user");
    }

    await this.users.destroy({ where: { id: userId } });

    return findUser;
  }
}

export default UserService;
