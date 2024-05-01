import { useStorage } from '@plasmohq/storage/hook';
import { storage } from '.';

export function useStorageWord() {
  const [get, set] = useStorage(
    {
      key: 'UnKnownWordList',
      instance: storage,
    },
    (v) => (v === undefined ? [] : v),
  );
  return [get, set];
}
