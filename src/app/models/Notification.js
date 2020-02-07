import Sequelize, { Model } from 'sequelize';
import sendNotification from '../../utils/sendNotification';

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
      sendNotification(notification);
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'receiver_id', as: 'receiver' });
  }
}

export default Notification;
