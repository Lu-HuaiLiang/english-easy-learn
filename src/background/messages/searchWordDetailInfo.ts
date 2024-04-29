import type { PlasmoMessaging } from '@plasmohq/messaging';

const map = new Map();

const searchWordDetailInfo = async (inputValue) =>
  fetch(
    `http://${process.env.PLASMO_PUBLIC_HOST}:3000/searchWordDetailInfo?word=${inputValue}`,
  )
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res;
    });

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const get = map.get(req.body.input);
  if (get) {
    // console.log('use store');
    return res.send({
      message: get,
    });
  }
  const message = await searchWordDetailInfo(req.body.input);
  map.set(req.body.input, message);
  res.send({
    message,
  });
};

export default handler;
