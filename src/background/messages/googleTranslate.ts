import type { PlasmoMessaging } from '@plasmohq/messaging';
import { GoogleTranslate } from '~contents/shared/utils/translateUtils/index.js';

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const message = await GoogleTranslate(req.body.selectedText, req.body.option);
  res.send({
    message,
  });
};

export default handler;
