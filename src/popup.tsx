import { useEffect, useRef, useState } from 'react';
import { storage } from '~contents/shared/utils/storageUtils';
import { useStorage } from '@plasmohq/storage/hook';
import { sendToBackground } from '@plasmohq/messaging';
import { link } from 'fs';

const extractOrigin = (url: string): string => {
  const parser = new URL(url);
  return parser.origin;
};

const extractPathname = (url: string): string => {
  const parser = new URL(url);
  return parser.hostname;
};

const RecommendList = [
  {
    name: '🔗 跟着LR吃瓜学英语',
    link: 'https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA5MjM3NDk5Ng%3D%3D&action=getalbum&album_id=1786181186118057992',
  },
  {
    name: '🔗 跟着LR看新闻学英语',
    link: 'https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA5MjM3NDk5Ng%3D%3D&action=getalbum&album_id=2232928099707486216',
  },
  {
    name: '🔗 二十大报告笔记｜微信',
    link: 'https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA5MjM3NDk5Ng%3D%3D&action=getalbum&album_id=2625814674491621377',
  },
  {
    name: '🔗 政府工作报告笔记｜微信',
    link: 'https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA5MjM3NDk5Ng%3D%3D&action=getalbum&album_id=1786177117945167873',
  },
  {
    name: '🔗 吃瓜英语阅读网站｜微信',
    link: 'https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA5MjM3NDk5Ng==&action=getalbum&album_id=2973735650787115013',
  },
  {
    name: '🔗 经济学人｜微信',
    link: 'https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA5MjM3NDk5Ng%3D%3D&action=getalbum&album_id=2209670519946313732',
  },
  {
    name: '🔗 Albert英语研习社｜bilibili',
    link: 'https://space.bilibili.com/365212208',
  },
  {
    name: '🔗 邵艾伦Alan｜bilibili',
    link: 'https://space.bilibili.com/4029133',
  },
];

function IndexPopup() {
  const [currentWebsite, setCurrentWebsite] = useState<string>('');
  const [get, set] = useStorage({
    key: 'blacklistWeb',
    instance: storage,
  });
  const [checked, setChecked] = useState(true);
  const activeTabURL = useRef('');

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const url = activeTab.url;
      const website = extractPathname(url);
      activeTabURL.current = extractOrigin(url);
      setCurrentWebsite(website);
      setChecked(
        get && Array.isArray(get)
          ? !get.some((l) => activeTabURL.current === l)
          : true,
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
        📇 English. Assit.
        <span
          style={{
            fontFamily: 'Avenir Next',
            fontSize: '12px',
            // color: 'grey',
            fontWeight: '500',
            marginLeft: '8px',
            marginBottom: '8px',
          }}
        >
          {/* {process.env.PLASMO_TAG} */}v1.0.0
        </span>
      </h1>
      <div
        style={{
          padding: '10px',
          borderRadius: '4px',
          background: '#eee',
        }}
      >
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
                  return get.filter((a) => a !== activeTabURL.current);
                });
              } else {
                set((get) => {
                  if (Array.isArray(get)) {
                    return Array.from(
                      new Set(get.concat(activeTabURL.current)),
                    );
                  } else {
                    return [activeTabURL.current];
                  }
                });
              }
            }}
            style={{ cursor: 'pointer' }}
            type="checkbox"
            checked={checked}
          />
        </div>
        <div
          style={{
            marginLeft: '12px',
            marginTop: '4px',
            width: '165px',
            color: '',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {currentWebsite}
        </div>
      </div>
      <div
        style={{
          fontSize: '13px',
          marginTop: '20px',
          marginBottom: '10px',
        }}
      >
        学习链接分享🍞
      </div>
      {RecommendList?.map((i) => {
        return (
          <div
            key={i.name}
            style={{
              cursor: 'pointer',
              marginBottom: '5px',
              // textDecorationLine: 'underline',
              color: 'rgb(0 123 198)',
              width: 'fit-content',
            }}
            onClick={() =>
              chrome.tabs.create({
                url: i.link,
              })
            }
          >
            {i.name}
          </div>
        );
      })}
    </div>
  );
}

export default IndexPopup;
