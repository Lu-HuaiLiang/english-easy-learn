import type { PlasmoMessaging } from '@plasmohq/messaging';

const forLowerCase = (text) => {
  return text?.toLowerCase();
};

function find(props) {
  const { TextelsNodeValue, materialList } = props;

  const elIndexs = TextelsNodeValue.reduce((pre, cur, index) => {
    const hasExist = materialList.some((it) => {
      return forLowerCase(cur).includes(forLowerCase(it.text));
    });
    return hasExist ? [...pre, index] : pre;
  }, []);

  return elIndexs;
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const message = find(req.body);
  res.send({
    message,
  });
};

export default handler;
