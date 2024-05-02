import type { PlasmoMessaging } from '@plasmohq/messaging';
import { storage } from '~contents/shared/utils/storageUtils';

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
  const storageWordMap = (await storage.get('wordMap')) as Array<[string, any]>;
  const defaultMap = new Map();
  const map = storageWordMap ? new Map(storageWordMap) : defaultMap;
  const get = map.get(req.body.input);
  if (get) {
    return res.send({
      message: get,
    });
  }
  const message = await searchWordDetailInfo(req.body.input);
  map.set(req.body.input, message);
  storage.set('wordMap', Array.from(map.entries()));
  res.send({
    message,
  });
};

export default handler;
