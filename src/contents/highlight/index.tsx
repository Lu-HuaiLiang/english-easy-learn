import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from 'plasmo';
import cssText from 'data-text:./index.css';
import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { wordbook } from './store';
import { Display } from '~contents/highlight/components/Display';
import { getFixedPostion } from '../shared/utils/index';
import { useHighlight } from './hook/useHighlight';
import { useFloatButtonState } from './hook/useFloatButtonState';
import { useJudgeIsTrigger } from '~contents/shared/hooks/JudgeIsTrigger';
import { OpenDisplayFrom } from './utils/type';
import { sendToBackground } from '@plasmohq/messaging';

export const config: PlasmoCSConfig = {
  matches: ['https://mp.weixin.qq.com/*'],
};

// Inject into the ShadowDOM
export const getStyle = () => {
  const style = document.createElement('style');
  style.textContent = cssText;
  return style;
};

export const getInlineAnchor: PlasmoGetInlineAnchor = () => document.body;

// Use this to optimize unmount lookups
export const getShadowHostId = () => 'plasmo-inline-example-unique-id';

function useGetUnKnownWordList(): any {
  const [UnKnownWordList, setUnknownWordList] = useState([]);
  useEffect(() => {
    (async () => {
      const resp = await sendToBackground({
        name: 'searchUnknownWordByEmail',
        body: {
          email: '815220870@qq.com',
        },
      });
      console.log(resp.message);
      resp.message && setUnknownWordList(resp.message);
    })();
  }, []);
  return [UnKnownWordList, setUnknownWordList];
}

const PlasmoInline = () => {
  const [selectedText, setSelectedText] = useState('');
  const [openDisplayFrom, setOpenDisplayFrom] = useState(OpenDisplayFrom.Close);
  const [targetRect, setTargetRect] = useState<DOMRect | undefined>();
  const [UnKnownWordList, setUnknownWordList] = useGetUnKnownWordList();
  const { saveTrigger, isTrigger } = useJudgeIsTrigger();
  const [floatButtonVisible, setFloatButtonVisible] = useState(false);
  const leaveHighlightTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useHighlight({
    leaveHighlightTimerRef,
    UnKnownWordList,
    setUnknownWordList,
    setTargetRect,
    setOpenDisplayFrom,
    setSelectedText,
    setFloatButtonVisible,
  });

  useFloatButtonState({
    floatButtonVisible,
    setFloatButtonVisible,
    isTrigger,
    openDisplayFrom,
    setOpenDisplayFrom,
    setSelectedText,
    setTargetRect,
  });

  return (
    <div>
      {floatButtonVisible && (
        <button
          ref={saveTrigger}
          style={{
            position: 'fixed',
            zIndex: '9999',
            ...getFixedPostion(56, 25, targetRect),
          }}
          onClick={() => {
            setFloatButtonVisible(false);
            setOpenDisplayFrom(OpenDisplayFrom.FloatBtn);
          }}
        >
          查单词
        </button>
      )}
      <div
        ref={saveTrigger}
        style={{
          position: 'fixed',
          zIndex: '9999',
          ...getFixedPostion(400, 500, targetRect),
          visibility:
            openDisplayFrom !== OpenDisplayFrom.Close ? 'visible' : 'hidden',
        }}
        onMouseEnter={() => {
          setFloatButtonVisible(false);
          leaveHighlightTimerRef.current &&
            clearTimeout(leaveHighlightTimerRef.current);
        }}
        onMouseLeave={() => {
          openDisplayFrom === OpenDisplayFrom.Highlight &&
            setOpenDisplayFrom(OpenDisplayFrom.Close);
        }}
      >
        <Display
          UnKnownWordList={UnKnownWordList}
          selectedText={selectedText}
        />
      </div>
    </div>
  );
};

export default PlasmoInline;
