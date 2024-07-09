import type { PlasmoMessaging } from '@plasmohq/messaging';
// import { allWords } from '~contents/shared/const/word';

const searchWordDetailInfoByQiNiu = async (inputValue) =>
  fetch(`http://static.haojian.fun/words/${inputValue}.json`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res;
    });
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  // 这里是因为 static.haojian.fun 的文件会有二次encodeURIComponent的情况。
  const input = encodeURIComponent(encodeURIComponent(req.body.input));
  // 遍历了一下所有的单词长度最多60！
  if (
    !req.body.input ||
    typeof req.body.input !== 'string' ||
    input.length > 60
  ) {
    res.send({
      message: [],
    });
    return;
  }
  // 单词不在单词表里面就不要去查找了！
  // const find = allWords.find(
  //   (w) => w.toLowerCase() === req.body.input.toLowerCase(),
  // );
  // if (!find) {
  //   res.send({
  //     message: [],
  //   });
  //   return;
  // }
  const resp = await searchWordDetailInfoByQiNiu(input);
  res.send({
    message: resp?.['error'] ? [] : [resp],
  });
};

export default handler;
