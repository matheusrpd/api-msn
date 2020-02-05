import Sequelize, { Model } from 'sequelize';
import axios from 'axios';

class Notification extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        content: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('afterCreate', async notification => {
      const { title, content: body } = notification;

      const contentNotification = {
        notification: {
          title,
          body,
          click_action: 'http://localhost:3000/',
          icon: '',
        },
        to: '',
      };

      const reqConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.KEY_SERVER_FIREBASE,
        },
      };

      await axios.post(
        'https://fcm.googleapis.com/fcm/send',
        contentNotification,
        reqConfig
      );
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'receiver_id', as: 'receiver' });
  }
}

export default Notification;
