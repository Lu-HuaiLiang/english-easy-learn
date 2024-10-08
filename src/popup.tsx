import { useEffect, useRef, useState } from 'react';
import { storage } from '~contents/shared/utils/storageUtils';
import { useStorage } from '@plasmohq/storage/hook';
import { useGetUnKnownWordList } from '~contents/shared/utils/storageUtils/word';

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
    name: '🔗 吃瓜英语阅读网站｜微信',
    link: 'https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA5MjM3NDk5Ng==&action=getalbum&album_id=2973735650787115013',
  },
  {
    name: '🔗 Albert英语研习社｜bilibili',
    link: 'https://space.bilibili.com/365212208',
  },
  {
    name: '🔗 Albert英语研习社新闻稿｜微信',
    link: 'https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzI3ODM3MjQ5MA==&action=getalbum&album_id=1397694509848559620&subscene=126',
  },
  {
    name: '🔗 邵艾伦Alan｜bilibili',
    link: 'https://space.bilibili.com/4029133',
  },
];

function IndexPopup() {
  const [currentWebsite, setCurrentWebsite] = useState<string>('');
  const [get, set] = useStorage(
    {
      key: 'whitelistWeb',
      instance: storage,
    },
    (v) => (v === undefined ? [] : v),
  );
  const [UnKnownWordList, setUnknownWordList] = useGetUnKnownWordList();
  const [checked, setChecked] = useState(false);
  const activeTabURL = useRef('');
  const [hasCopy, setHasCopy] = useState(false);
  const [hasDelete, setHasDelete] = useState(false);
  const [hasLockDelete, setHasLockDelete] = useState(true);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const url = activeTab.url;
      const website = extractPathname(url);
      activeTabURL.current = extractOrigin(url);
      setCurrentWebsite(website);
      setChecked(
        get && Array.isArray(get)
          ? get.some((l) => activeTabURL.current === l)
          : false,
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
        width: '220px',
        borderRadius: '5px',
      }}
    >
      <h1 style={{ fontFamily: 'Avenir Next', fontSize: '16px' }}>
        <span style={{ fontFamily: 'Avenir Next', fontSize: '25px' }}>🍊</span>{' '}
        easy·learn
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
          v1.0.0
        </span>
        <span
          style={{
            fontFamily: 'Avenir Next',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: '700',
            marginLeft: '28px',
            marginBottom: '8px',
            textDecorationLine: 'underline',
          }}
          onClick={() => {
            chrome.tabs.create({
              url: 'https://github.com/Lu-HuaiLiang/english-easy-learn',
            });
          }}
        >
          github
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
                  return Array.from(new Set(get.concat(activeTabURL.current)));
                });
              } else {
                set((get) => {
                  return get.filter((a) => a !== activeTabURL.current);
                });
              }
              chrome.tabs.query(
                { active: true, currentWindow: true },
                function (tabs) {
                  // Reload the active tab
                  chrome.tabs.reload(tabs[0].id);
                },
              );
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
          fontWeight: '700',
          fontSize: '13px',
          marginTop: '20px',

          fontFamily: 'Avenir Next',
        }}
      >
        生词管理｜Unknown Management
      </div>
      <div
        style={{
          fontSize: '13px',
          marginTop: '10px',
          width: 'fit-content',
          borderBottom: '1px dotted #00a792',
          cursor: 'pointer',
        }}
        onClick={() => {
          navigator.clipboard.writeText(UnKnownWordList?.join('\u000A') ?? '');
          setHasCopy(true);
        }}
      >
        复制生词本的所有生词 {hasCopy ? '🟢' : '⚪️'}
      </div>
      <div
        style={{
          fontSize: '13px',
          marginTop: '10px',
          width: 'fit-content',
          borderBottom: '1px dotted #00a792',
          cursor: 'pointer',
        }}
        onClick={() => {
          chrome.tabs.create({ url: 'options.html' });
        }}
      >
        单词导入生词本
      </div>
      <div
        style={{
          fontSize: '13px',
          marginTop: '10px',
          marginBottom: '10px',
          // width: 'fit-content',
          borderBottom: '1px dotted #00a792',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div
          onClick={() => {
            if (hasLockDelete) {
              return;
            }
            setUnknownWordList([]);
            setHasDelete(true);
          }}
        >
          清空生词本 {!hasLockDelete ? (hasDelete ? '🟢' : '⚪️') : ''}
        </div>
        <div
          onClick={() => {
            setHasLockDelete((a) => !a);
          }}
        >
          {hasLockDelete ? '开锁🔐' : '锁开🔓'}
        </div>
      </div>
      <div
        style={{
          fontWeight: '700',
          fontSize: '13px',
          marginTop: '13px',
          marginBottom: '10px',
          fontFamily: 'Avenir Next',
        }}
      >
        学习链接｜Study LinK
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
