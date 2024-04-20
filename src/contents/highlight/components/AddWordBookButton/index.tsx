import { sendToBackground } from '@plasmohq/messaging';
import { useStorage } from '@plasmohq/storage/hook';
import { useState } from 'react';
import { wordbook } from '~contents/highlight/store';
import { event } from '~contents/shared/utils/event';

const updateUnknownWordByEmail = (words: string[]) =>
  sendToBackground({
    name: 'updateUnknownWordByEmail',
    body: {
      email: '815220870@qq.com',
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
      {isAdd ? '✅ 已加入单词本' : '⏏️ 加入单词本'}
    </div>
  );
}
