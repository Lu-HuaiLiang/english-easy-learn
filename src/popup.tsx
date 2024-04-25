import { useEffect, useState } from 'react';
import { storage } from '~contents/shared/utils/storageUtils';
import { useStorage } from '@plasmohq/storage/hook';

function extractWebsite(url) {
  var parser = new URL(url);
  return parser.hostname;
}

function IndexPopup() {
  const [currentWebsite, setCurrentWebsite] = useState<string>('');
  const [get, set] = useStorage({
    key: 'blacklistWeb',
    instance: storage,
  });

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const url = activeTab.url;
      const website = extractWebsite(url);
      setCurrentWebsite(website);
    });
  }, []);

  const extractWebsite = (url: string): string => {
    const parser = new URL(url);
    return parser.origin;
  };

  // useEffect(() => {
  //   localStorage.setItem('blacklistWeb', JSON.stringify(get));
  // }, [get]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '5px 10px',
        width: '200px',
        borderRadius: '5px',
      }}
    >
      <h1 style={{ fontFamily: 'Avenir Next', fontSize: '16px' }}>
        📇 English Assistant {JSON.stringify(get)}
      </h1>
      <div
        style={{
          fontFamily: 'Avenir Next',
          fontSize: '13px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        📍允许在此网站运行？
        <input
          // disabled={true}
          onChange={(e) => {
            if (e.target.checked) {
              set((get) => {
                if (Array.isArray(get)) {
                  return Array.from(new Set(get.concat(currentWebsite)));
                } else {
                  return [currentWebsite];
                }
              });
            } else {
              set((get) => {
                return get.filter((a) => a !== currentWebsite);
              });
            }
          }}
          style={{ cursor: 'pointer' }}
          type="checkbox"
          defaultChecked={
            get && Array.isArray(get)
              ? !get.some((l) => currentWebsite === l)
              : true
          }
        />
      </div>
      <div style={{ marginLeft: '12px', marginTop: '4px', color: '' }}>
        {currentWebsite}
      </div>
      {/* <footer>Crafted by LuHuailiang</footer> */}
    </div>
  );
}

export default IndexPopup;
