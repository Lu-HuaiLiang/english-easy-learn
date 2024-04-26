import { useEffect, useState } from 'react';
import { storage } from '~contents/shared/utils/storageUtils';
import { useStorage } from '@plasmohq/storage/hook';

const extractWebsite = (url: string): string => {
  const parser = new URL(url);
  return parser.origin;
};

function IndexPopup() {
  const [currentWebsite, setCurrentWebsite] = useState<string>('');
  const [get, set] = useStorage({
    key: 'blacklistWeb',
    instance: storage,
  });
  const [checked, setChecked] = useState(true);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const url = activeTab.url;
      const website = extractWebsite(url);
      setCurrentWebsite(website);
      setChecked(
        get && Array.isArray(get) ? !get.some((l) => website === l) : true,
      );
    });
  }, [get]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0px 10px',
        paddingBottom: '5px',
        width: '200px',
        borderRadius: '5px',
      }}
    >
      <h1 style={{ fontFamily: 'Avenir Next', fontSize: '16px' }}>
        📇 English Assistant{' '}
        <span style={{ fontSize: '13px', color: 'grey' }}>
          ({process.env.PLASMO_TAG})
        </span>
      </h1>
      <div
        style={{
          cursor: 'pointer',
          marginBottom: '10px',
          textDecorationLine: 'underline',
          color: 'rgb(0 123 198)',
          width: 'fit-content',
        }}
        onClick={() =>
          chrome.tabs.create({
            url: 'https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA5MjM3NDk5Ng==&action=getalbum&album_id=2973735650787115013&scene=173&subscene=&sessionid=svr_044cd68460d&enterid=1712978938&from_msgid=2650773861&from_itemidx=2&count=3&nolastread=1#wechat_redirect',
          })
        }
      >
        🔗 吃瓜英语阅读网站｜微信
      </div>
      <div
        style={{
          cursor: 'pointer',
          marginBottom: '10px',
          textDecorationLine: 'underline',
          color: 'rgb(0 123 198)',
          width: 'fit-content',
        }}
        onClick={() =>
          chrome.tabs.create({
            url: 'https://space.bilibili.com/365212208?spm_id_from=333.337.0.0',
          })
        }
      >
        🔗 Albert英语研习社｜bilibili
      </div>
      <div
        style={{
          cursor: 'pointer',
          marginBottom: '10px',
          textDecorationLine: 'underline',
          color: 'rgb(0 123 198)',
          width: 'fit-content',
        }}
        onClick={() =>
          chrome.tabs.create({
            url: 'https://space.bilibili.com/4029133',
          })
        }
      >
        🔗 邵艾伦Alan｜bilibili
      </div>
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
            setChecked(e.target.checked);
            if (e.target.checked) {
              set((get) => {
                return get.filter((a) => a !== currentWebsite);
              });
            } else {
              set((get) => {
                if (Array.isArray(get)) {
                  return Array.from(new Set(get.concat(currentWebsite)));
                } else {
                  return [currentWebsite];
                }
              });
            }
          }}
          style={{ cursor: 'pointer' }}
          type="checkbox"
          checked={checked}
        />
      </div>
      <div style={{ marginLeft: '12px', marginTop: '4px', color: '' }}>
        {currentWebsite}
      </div>
    </div>
  );
}

export default IndexPopup;
