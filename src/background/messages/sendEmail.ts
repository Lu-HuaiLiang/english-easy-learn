import type { PlasmoMessaging } from '@plasmohq/messaging';
// import sgMail from '@sendgrid/mail';
// sgMail.setApiKey('uvsvweuefrgdbcah'); // 设置你的 SendGrid API 密钥

// const searchWordDetailInfo = async (inputValue) =>

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  res.send({});
};

export default handler;
