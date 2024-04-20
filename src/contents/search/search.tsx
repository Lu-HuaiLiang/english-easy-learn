import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from 'plasmo';
import cssText from 'data-text:~/contents/search/search.css';
import { sendToBackground } from '@plasmohq/messaging';
import { useEffect, useState } from 'react';

export const config: PlasmoCSConfig = {
  matches: ['https://mp.weixin.qq.com/*'],
};

// Inject into the ShadowDOM
export const getStyle = () => {
  const style = document.createElement('style');
  style.textContent = cssText;
  return style;
};

export const GetSearchList = async (inputValue) =>
  fetch(
    `https://dict.youdao.com/suggest?num=5&ver=3.0&doctype=json&cache=false&le=en&q=${inputValue}`,
  )
    .then((res) => res.json())
    .then((res) => res.data);

export const getInlineAnchor: PlasmoGetInlineAnchor = () => document.body;

// Use this to optimize unmount lookups
export const getShadowHostId = () => 'plasmo-inline-example-unique-id';

const PlasmoInline = () => {
  return <></>;

  const [exist, setExist] = useState(false);
  const [entries, setEntries] = useState<{ explain: string; entry: string }[]>(
    [],
  );

  const onChange = async (e) => {
    const resp = await sendToBackground({
      name: 'ping',
      body: {
        input: e.target.value,
      },
    });
    setEntries(resp?.message?.entries ?? []);
    console.log(resp);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // console.log('⌥+F 组合键被按下', event.altKey, event.key);
      if (event.altKey && event.key === 'ƒ') {
        // console.log('⌥+F 组合键被按下');
        setExist(true);
      }
    };

    // 添加键盘事件监听器
    window.addEventListener('keydown', handleKeyDown);
    // 清理函数，用于在组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      {exist ? (
        <div className="lingo-search-wrapper">
          <div
            style={
              entries.length
                ? {}
                : {
                    borderRadius: '12px',
                  }
            }
            className="lingo-search"
          >
            <input
              className="lingo-search-input"
              onChange={onChange}
              placeholder="输入想要翻译的内容"
            ></input>
          </div>
          <div className="lingo-search__contentWrap">
            <div className="SuggestList">
              {entries.map((item) => {
                return (
                  <div className="SuggestList__item">
                    <div className="SuggestList__word">{item.entry}</div>
                    <div className="SuggestList__explain_list">
                      {item.explain}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default PlasmoInline;
