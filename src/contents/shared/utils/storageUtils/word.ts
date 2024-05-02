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

const searchUnknownWordByEmail = async () => {
  const resp = await sendToBackground({
    name: 'searchUnknownWordByEmail',
    body: {
      email: process.env.PLASMO_PUBLIC_USER_EMAIL,
    },
  });
  return resp.message;
};

export async function GetWordDetail(selectedText: string) {
  const wo = (await storage.get('word')) || {};
  if (wo[selectedText]) {
    return wo[selectedText];
  }
  const resp = await sendToBackground({
    name: 'searchWordDetailInfo',
    body: {
      input: selectedText,
    },
  });
  wo[selectedText] = resp.message;
  storage.set('word', wo);
  return resp.message;
}

export function useGetUnKnownWordList() {
  const [UnKnownWordList, setUnknownWordList] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      if (process.env.PLASMO_PUBLIC_USER_EMAIL) {
        const resp = await searchUnknownWordByEmail();
        resp && setUnknownWordList(resp);
      } else {
        const resp = (await storage.get('UnKnownWordList')) as [];
        resp && setUnknownWordList(resp || []);
      }
    })();
  }, []);
  const setState1 = (arr: string[]) => {
    if (process.env.PLASMO_PUBLIC_USER_EMAIL) {
      updateUnknownWordByEmail(arr);
    } else {
      storage.set('UnKnownWordList', arr);
    }
    setUnknownWordList(arr);
  };
  return [UnKnownWordList, setState1];
}
