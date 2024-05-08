import { useEffect, useState } from 'react';
import { storage } from '../utils/storageUtils';

export function usePass() {
  const [whitelistWeb, setWhitelistWeb] = useState([]);
  useEffect(() => {
    (async () => {
      const whitelist = (await storage.get('whitelistWeb')) as string[];
      setWhitelistWeb(whitelist || []);
    })();
  }, []);
  const isPass = whitelistWeb.some((l) => l === window.origin);
  return isPass;
}
