// import type { PlasmoMessaging } from '@plasmohq/messaging';

// const SearchWord = async (inputValue) =>
//   fetch(
//     `https://dict.youdao.com/suggest?num=5&ver=3.0&doctype=json&cache=false&le=en&q=${inputValue}`,
//     {
//       mode: 'no-cors',
//     },
//   )
//     .then((res) => res.json())
//     .then((res) => res.data);

// const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
//   const message = await SearchWord(req.body.input);
//   res.send({
//     message,
//   });
// };

// export default handler;
