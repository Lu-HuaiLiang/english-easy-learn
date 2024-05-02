import { useStorage } from '@plasmohq/storage/hook';
import { storage } from '.';
import { useCallback, useEffect, useState } from 'react';
import { sendToBackground } from '@plasmohq/messaging';

const updateUnknownWordByEmail = (words: string[]) =>
  sendToBackground({
    name: 'updateUnknownWordByEmail',
    body: {
      email: process.env.PLASMO_PUBLIC_USER_EMAIL,
      wordJson: JSON.stringify(words),
    },
  });

export function useStorageWord() {
  const [UnKnownWordList, setUnknownWordList] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      if (process.env.PLASMO_PUBLIC_USER_EMAIL) {
        const resp = await sendToBackground({
          name: 'searchUnknownWordByEmail',
          body: {
            email: process.env.PLASMO_PUBLIC_USER_EMAIL,
          },
        });
        resp.message && setUnknownWordList(resp.message);
      } else {
        const resp = (await storage.get('UnKnownWordList')) as [];
        resp && setUnknownWordList(resp || []);
      }
    })();
  }, []);

  const setState1 = (arr: string[]) => {
    console.log(arr);
    if (process.env.PLASMO_PUBLIC_USER_EMAIL) {
      updateUnknownWordByEmail(arr);
    } else {
      storage.set('UnKnownWordList', arr);
    }
    setUnknownWordList(arr);
  };
  return [UnKnownWordList, setState1];
}
