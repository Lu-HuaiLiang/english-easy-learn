import { storage } from '.';
import { useEffect, useState } from 'react';
import { sendToBackground } from '@plasmohq/messaging';
import supabase from '~contents/shared/supabase';

const updateUnknownWordByEmail = (words: string[]) =>
  supabase
    .from('user_unknown_word')
    .update({ wordJson: JSON.stringify(words) })
    .eq('email', process.env.PLASMO_PUBLIC_USER_EMAIL)

const searchUnknownWordByEmail = async () => {
  let { data: user_unknown_word, error } = await supabase
    .from('user_unknown_word')
    .select('*')
    .eq('email', process.env.PLASMO_PUBLIC_USER_EMAIL);
  if (error) {
    return [];
  }
  return JSON.parse(user_unknown_word?.[0].wordJson) || [];
};

export async function GetWordDetail(selectedText: string) {
  const wo = (await storage.get('word')) || {};
  // console.log('wo[selectedText]', wo, wo[selectedText]);
  if (wo[selectedText]) {
    return wo[selectedText];
  }
  const resp = await sendToBackground({
    name: 'searchWordDetailInfo',
    body: {
      input: selectedText,
    },
  });
  if (Array.isArray(resp.message) && resp.message.length > 0) {
    // console.log('resp.message', resp.message);
    wo[selectedText] = resp.message;
    storage.set('word', wo);
  }
  return resp.message;
}

export function useGetUnKnownWordList(): [string[], (arr: string[]) => void] {
  const [UnKnownWordList, setUnknownWordList] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      if (
        process.env.PLASMO_PUBLIC_USER_EMAIL &&
        process.env.PLASMO_PUBLIC_SUPABASE_KEY
      ) {
        const resp = await searchUnknownWordByEmail();
        resp && setUnknownWordList(resp);
      } else {
        const resp = (await storage.get('UnKnownWordList')) as [];
        resp && setUnknownWordList(resp || []);
      }
    })();
  }, []);
  const setState1 = async (arr: string[]) => {
    setUnknownWordList(arr);
    if (
      process.env.PLASMO_PUBLIC_USER_EMAIL &&
      process.env.PLASMO_PUBLIC_SUPABASE_KEY
    ) {
      // 这里我也不知道为啥一定要加 await 才行
      await updateUnknownWordByEmail(arr);
    } else {
      storage.set('UnKnownWordList', arr);
    }
  };
  return [UnKnownWordList, setState1];
}
