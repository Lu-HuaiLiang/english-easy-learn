import type { PlasmoMessaging } from '@plasmohq/messaging';
import { host } from '~contents/shared/const';



const searchUnknownWordByEmail = async (email) =>
  fetch(`http://${host}:3000/searchUnknownWordByEmail?email=${email}`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res;
    });

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const message = await searchUnknownWordByEmail(req.body.email);
  res.send({
    message,
  });
};

export default handler;
