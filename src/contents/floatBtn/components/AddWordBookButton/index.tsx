import { useState } from 'react';
import { wordbook } from '~contents/highlight/store';
import { event } from '~contents/shared/utils/event';

export function AddWordBookButton(props: { selectedText: string }) {
  const { selectedText } = props;
  const [UnKnowWordList, setUnknowWordList] = useState(wordbook);
  const isAdd = UnKnowWordList.some((w) => w === selectedText);
  return (
    <div
      onClick={() => {
        if (isAdd) {
          const words = UnKnowWordList.filter((a) => a !== selectedText);
          setUnknowWordList(words);
          event.emit('update_unknowlist', words);
        } else {
          const words = UnKnowWordList.concat(selectedText);
          setUnknowWordList(words);
          event.emit('update_unknowlist', words);
        }
      }}
    >
      {isAdd ? '✅ 已加入单词本' : '⏏️ 加入单词本'}
    </div>
  );
}
