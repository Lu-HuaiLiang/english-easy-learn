import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from 'plasmo';
import cssText from 'data-text:~/contents/floatBtn/index.css';
import { sendToBackground } from '@plasmohq/messaging';
import { useEffect, useRef, useState } from 'react';

export const config: PlasmoCSConfig = {
  matches: ['https://mp.weixin.qq.com/*'],
};

// Inject into the ShadowDOM
export const getStyle = () => {
  const style = document.createElement('style');
  style.textContent = cssText;
  return style;
};

export function useHighlightText() {}

export const getInlineAnchor: PlasmoGetInlineAnchor = () => document.body;

// Use this to optimize unmount lookups
export const getShadowHostId = () => 'plasmo-inline-example-unique-id';
// const WordDetailDisplay = (props) => {
//   const { word } = props;

//   if (!word) {
//     return <></>;
//   }
//   console.log('detail', detail);
//   useEffect(() => {
//     (async () => {
//       const resp = await sendToBackground({
//         name: 'search_word',
//         body: {
//           input: word,
//         },
//       });
//       console.log(resp);
//       // resp.dict && setDetail(resp.dict);
//     })();
//   }, [word]);

//   return (

//   );
// };

interface IDetail {
  word: string;
  forms: string[];
  explain_list: {
    pos: string;
    meaning: string;
  }[];
  pronounces: {
    type: string;
    phonetic: string;
    audio: {
      audio_url: string;
    };
  }[];
  synonyms: {
    cn_text: string;
    word: string[];
  };
  phrases: {
    text: string;
    trans: string[];
  }[];
  sentences: {
    text: string;
    tran: string;
    audio: {
      audio_url: string;
    };
    text_indexes: {
      start: number;
      end: number;
    }[];
  }[];
}

const PlasmoInline = () => {
  const [selectedText, setSelectedText] = useState('');
  const [buttonVisible, setButtonVisible] = useState(false);
  const [displayVisible, setDisplayVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const triggerNodeSet = useRef<Set<HTMLElement>>(new Set());
  const [detail, setDetail] = useState<IDetail[]>([]);

  const saveTrigger = (node: HTMLElement | null) => {
    if (node) {
      triggerNodeSet.current!.add(node);
    }
  };

  console.log('buttonVisible', buttonVisible, buttonPosition, detail);

  useEffect(() => {
    const closeDropdown = (event: MouseEvent) => {
      const isTrigger = Array.from(triggerNodeSet.current).some(
        (node) =>
          event.target?.contains(node) ||
          event.target?.shadowRoot?.contains(node),
      );
      if (buttonVisible && !isTrigger) {
        setButtonVisible(false);
      }
      if (displayVisible && !isTrigger) {
        setDisplayVisible(false);
      }
    };
    window.addEventListener('click', closeDropdown);
    return function cleanup() {
      window.removeEventListener('click', closeDropdown);
    };
  }, [buttonVisible, displayVisible]);

  useEffect(() => {
    document.body.style.position = 'relative';
    const handleSelection = () => {
      const selection = window.getSelection();
      const selectedString = selection.toString().trim();
      if (selectedString !== '') {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectedText(selectedString);
        setButtonPosition({
          x: rect.left,
          y: rect.bottom,
        });
        setButtonVisible(true);
      }
    };
    document.addEventListener('dblclick', handleSelection);
    return () => document.removeEventListener('dblclick', handleSelection);
  }, [displayVisible]);

  useEffect(() => {
    if (!selectedText) {
      return;
    }
    (async () => {
      const resp = await sendToBackground({
        name: 'searchWord',
        body: {
          input: selectedText,
        },
      });
      console.log(resp.message);
      resp.message && setDetail(resp.message);
    })();
  }, [selectedText]);

  const handleClick = () => {
    // alert(`You selected: ${selectedText}`);
    setDisplayVisible(true);
  };

  return (
    <div>
      {buttonVisible && (
        <button
          ref={saveTrigger}
          style={{
            position: 'fixed',
            zIndex: '9999',
            top: buttonPosition.y,
            left: buttonPosition.x,
          }}
          onClick={handleClick}
        >
          查单词
        </button>
      )}
      <div
        style={{
          position: 'fixed',
          zIndex: '9999',
          top: buttonPosition.y,
          left: buttonPosition.x,
        }}
        ref={saveTrigger}
      >
        {selectedText && displayVisible && (
          <div className="display-container" id="show-container">
            <div className="selection-display" onClick={async () => {}}>
              {selectedText}
            </div>
            <div className="detail_content">
              {detail.map((d) => {
                return (
                  <div className="">
                    <div className="pronounces_list">
                      {d.pronounces.map((i) => {
                        return (
                          <span className="pronounces_item">
                            {i.type === 'US' ? '美' : '英'}{' '}
                            {i.phonetic ? `/${i.phonetic}/` : ''}
                          </span>
                        );
                      })}
                    </div>
                    <div className="explain_list">
                      {d.explain_list.map((i) => {
                        return (
                          <div className="explain_list_item">
                            {i.pos && (
                              <div className="explain_list_pos">{i.pos}</div>
                            )}
                            <div className="explain_list_meaning">
                              {i.meaning}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {d.sentences && d.sentences.length && (
                      <div className="sentences_title">🍊 Sentences</div>
                    )}
                    <div className="sentences_list">
                      {d.sentences &&
                        d.sentences?.map((i) => {
                          return (
                            <div className="sentences_list_item">
                              <div className="sentences_list_item_text">
                                <div className="sentences_list_item_dottt">
                                  ▫️
                                </div>
                                {i.text}
                              </div>
                              <div className="sentences_list_item_tran">
                                {i.tran}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    <div className="forms_list">
                      {d.forms.map((i) => {
                        const p = i.split(' ');
                        return (
                          <div className="forms_list_item">
                            <div className="forms_list_item_up">{p[1]}</div>
                            <div className="forms_list_item_down">{p[0]}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlasmoInline;
