import config from 'config';
import Sequelize from 'sequelize';
import { dbConfig } from '@interfaces/db.interface';
import UserModel from '@models/users.model';
import CategoryModel from '@models/categories.model';

const { host, user, password, database, pool }: dbConfig = config.get('dbConfig');
const sequelize = new Sequelize.Sequelize(database, user, password, {
  host,
  dialect: 'mysql',
  timezone: '+09:00',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
  },
  pool: {
    min: pool.min,
    max: pool.max,
  },
  logQueryParameters: process.env.NODE_ENV === 'development',
  logging: false,
  benchmark: true,
});

sequelize.authenticate();

const DB = {
  Users: UserModel(sequelize),
  Categories: CategoryModel(sequelize),
  // connection instance (RAW queries)
  sequelize,
  // library
  Sequelize,
};

export default DB;
