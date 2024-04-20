import type { PlasmoMessaging } from '@plasmohq/messaging';
import { host } from '~contents/shared/const';

const searchWordDetailInfo = async (inputValue) =>
  fetch(`http://${host}:3000/searchWordDetailInfo?word=${inputValue}`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res;
    });

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const message = await searchWordDetailInfo(req.body.input);
  res.send({
    message,
  });
};

export default handler;
