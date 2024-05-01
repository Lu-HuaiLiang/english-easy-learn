import { sendToBackground } from '@plasmohq/messaging';
import { event } from '~contents/shared/utils/event';

const updateUnknownWordByEmail = (words: string[]) =>
  sendToBackground({
    name: 'updateUnknownWordByEmail',
    body: {
      email: process.env.PLASMO_PUBLIC_USER_EMAIL,
      wordJson: JSON.stringify(words),
    },
  });

export function AddWordBookButton(props: {
  selectedText: string;
  UnKnownWordList: string[];
}) {
  const { selectedText, UnKnownWordList = [] } = props;
  const isAdd = UnKnownWordList?.some((w) => w === selectedText);
  return (
    <div
      className="noselect"
      style={{
        borderBottom: isAdd ? '1px dotted #00a792' : '1px dotted grey',
      }}
      onClick={() => {
        if (isAdd) {
          updateUnknownWordByEmail(
            UnKnownWordList.filter((w) => w !== selectedText),
          );
          event.emit('delete_unknown', selectedText);
        } else {
          updateUnknownWordByEmail(UnKnownWordList.concat(selectedText));
          event.emit('add_unknown', selectedText);
        }
      }}
    >
      {isAdd ? '🟢 已加生词本' : '⚪️ 点击加生词'}
    </div>
  );
}
