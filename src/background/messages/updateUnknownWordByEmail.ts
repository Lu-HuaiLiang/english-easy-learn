import type { PlasmoMessaging } from '@plasmohq/messaging';

// 定义请求配置对象

const updateUnknownWordByEmail = async (data) => {
  const requestOptions = {
    method: 'POST', // 请求方法为 POST
    headers: {
      'Content-Type': 'application/json', // 指定请求体的内容类型为 JSON
    },
    body: JSON.stringify(data), // 将请求体数据转换为 JSON 字符串
  };

  return fetch(
    `http://${process.env.PLASMO_PUBLIC_HOST}:3000/updateUnknownWordByEmail`,
    requestOptions,
  )
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res;
    });
};

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const message = await updateUnknownWordByEmail(req.body);
  res.send({
    message,
  });
};

export default handler;
