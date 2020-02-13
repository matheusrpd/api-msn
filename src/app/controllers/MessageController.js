import { parseISO } from 'date-fns';

import Message from '../models/Message';
import User from '../models/User';
import Notification from '../models/Notification';

class MessageController {
  async index(req, res) {
    const messages = await Message.findAll({
      where: { receiver_id: req.userId },
      attributes: ['id', 'text', 'date'],
      order: [['date', 'DESC']],
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(messages);
  }

  async store(req, res) {
    const { text, date, receiver_id } = req.body;

    /**
     * Verificando se o receiver existe.
     */
    const receiver = await User.findByPk(receiver_id);
    if (!receiver) {
      return res.status(400).json({ error: 'User not exists.' });
    }

    /**
     * Verificando se o sender e o receiver são as mesmas pessoas.
     */
    if (req.userId === receiver.id) {
      return res
        .status(400)
        .json({ error: 'You cannot send a message to yourself' });
    }

    const parsedDate = parseISO(date);

    const message = await Message.create({
      text,
      date: parsedDate,
      sender_id: req.userId,
      receiver_id: receiver.id,
    });

    /**
     * Criando notificação para o receiver
     */
    await Notification.create({
      title: 'Nova mensagem recebida',
      content: text,
      receiver_id: receiver.id,
    });

    return res.json(message);
  }
}

export default new MessageController();
