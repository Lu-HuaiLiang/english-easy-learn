import { useEffect, useState } from 'react';
import { storage } from '../utils/storageUtils';

export function useBan() {
  const [blacklistWeb, setBlacklistWeb] = useState([]);
  useEffect(() => {
    (async () => {
      const blacklist = (await storage.get('blacklistWeb')) as string[];
      setBlacklistWeb(blacklist);
    })();
  }, []);
  const isBan = blacklistWeb.some((l) => l === window.origin);
  return isBan;
}
