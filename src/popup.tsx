import { useEffect, useState } from 'react';

function extractWebsite(url) {
  var parser = new URL(url);
  return parser.hostname;
}

function IndexPopup() {
  const [data, setData] = useState('');
  const [currentWebsite, setCurrentWebsite] = useState<string>('');

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
    return parser.hostname;
  };
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
        📇 English Assistant
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
          disabled={true}
          style={{ cursor: 'pointer' }}
          type="checkbox"
          defaultChecked={true}
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
