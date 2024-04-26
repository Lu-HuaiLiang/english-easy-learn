import type { PlasmoMessaging } from '@plasmohq/messaging';

const searchUnknownWordByEmail = async (email) =>
  fetch(
    `http://${process.env.PLASMO_PUBLIC_HOST}:3000/searchUnknownWordByEmail?email=${email}`,
  )
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
