import type { PlasmoMessaging } from '@plasmohq/messaging';
import { allWords } from '~contents/shared/const/word';

const searchWordDetailInfoByOwnServer = async (inputValue) =>
  fetch(
    `http://${process.env.PLASMO_PUBLIC_HOST}:3000/searchWordDetailInfo?word=${inputValue}`,
  )
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res;
    });
const searchWordDetailInfoByQiNiu = async (inputValue) =>
  fetch(`http://static.haojian.fun/words/${inputValue}.json`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res;
    });
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const input = encodeURIComponent(req.body.input);
  // 遍历了一下所有的单词长度最多60！
  if (
    !req.body.input ||
    typeof req.body.input !== 'string' ||
    input.length > 60
  ) {
    console.log('length', req.body.input.length);
    res.send({
      message: [],
    });
    return;
  }
  // 单词不在单词表里面就不要去查找了！
  const wrong_word = !allWords.includes(req.body.input.toLowerCase());
  if (wrong_word) {
    console.log('wrong_word', req.body.input, wrong_word);
    res.send({
      message: [],
    });
    return;
  }
  if (process.env.PLASMO_PUBLIC_USER_EMAIL && process.env.PLASMO_PUBLIC_HOST) {
    const resp = await searchWordDetailInfoByOwnServer(input);
    res.send({
      message: resp,
    });
  } else {
    const resp = await searchWordDetailInfoByQiNiu(input);
    res.send({
      message: resp?.['error'] ? [] : [resp],
    });
  }
};

export default handler;
