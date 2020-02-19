import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import User from '../app/models/User';
import Message from '../app/models/Message';
import Notification from '../app/models/Notification';

const models = [User, Message, Notification];

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (process.env.ENVIRONMENT === 'production') {
      this.connection = new Sequelize(databaseConfig.production);
    } else {
      this.connection = new Sequelize(databaseConfig.development);
    }

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
