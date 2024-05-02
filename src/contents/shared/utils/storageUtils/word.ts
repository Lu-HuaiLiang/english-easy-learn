import { useStorage } from '@plasmohq/storage/hook';
import { storage } from '.';
import { useEffect, useState } from 'react';
import { sendToBackground } from '@plasmohq/messaging';

function useGetUnKnownWordList(): any {
  const [UnKnownWordList, setUnknownWordList] = useState([]);
  useEffect(() => {
    (async () => {
      const resp = await sendToBackground({
        name: 'searchUnknownWordByEmail',
        body: {
          email: process.env.PLASMO_PUBLIC_USER_EMAIL,
        },
      });
      resp.message && setUnknownWordList(resp.message);
    })();
  }, []);
  return [UnKnownWordList, setUnknownWordList];
}

const updateUnknownWordByEmail = (words: string[]) =>
  sendToBackground({
    name: 'updateUnknownWordByEmail',
    body: {
      email: process.env.PLASMO_PUBLIC_USER_EMAIL,
      wordJson: JSON.stringify(words),
    },
  });

export function useStorageWord() {
  const [getNetWord, setNetWord] = useGetUnKnownWordList();
  const setNetWord1 = (before) => {
    const after = before?.(getNetWord) || before;
    updateUnknownWordByEmail(after);
    setNetWord(after);
  };
  const [getStorage, setStorage] = useStorage(
    {
      key: 'UnKnownWordList',
      instance: storage,
    },
    (v) => (v === undefined ? [] : v),
  );
  return process.env.PLASMO_PUBLIC_USER_EMAIL
    ? [getNetWord, setNetWord1]
    : [getStorage, setStorage];
}
