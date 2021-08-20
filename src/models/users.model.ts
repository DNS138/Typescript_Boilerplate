import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { User } from '@interfaces/users.interface';
const maxLenEmail = 45;
const maxLenStr = 255;

export type UserCreationAttributes = Optional<User, 'id' | 'email' | 'password'>;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
  public id: number;
  public email: string;
  public password: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(maxLenEmail),
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(maxLenStr),
      },
    },
    {
      tableName: 'users',
      sequelize,
    },
  );

  return UserModel;
}
