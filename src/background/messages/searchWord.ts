import type { PlasmoMessaging } from '@plasmohq/messaging';

const SearchWord = async (inputValue) =>
  fetch(`http://112.74.40.32:3000/search?word=${inputValue}`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res;
    });

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const message = await SearchWord(req.body.input);
  res.send({
    message,
  });
};

export default handler;
