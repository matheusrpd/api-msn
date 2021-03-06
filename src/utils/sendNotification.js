import api from 'axios';
import User from '../app/models/User';

const sendNotification = async notification => {
  const receiver = await User.findByPk(notification.receiver_id);
  const { title, content: body } = notification;
  const URL = 'https://fcm.googleapis.com/fcm/send';

  const contentNotification = {
    notification: {
      title,
      body,
      click_action: 'https://frontend-msn.herokuapp.com',
    },
    to: receiver.token_notification,
  };

  const reqConfig = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `key=${process.env.KEY_SERVER_FIREBASE}`,
    },
  };

  try {
    await api.post(URL, contentNotification, reqConfig);
  } catch (error) {
    console.error(error);
  }
};

export default sendNotification;
