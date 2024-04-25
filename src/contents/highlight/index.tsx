import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from 'plasmo';
import cssText from 'data-text:./index.css';
import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { Display } from '~contents/highlight/components/Display';
import {
  getFixedPositionByRightBottomPoint,
  getFixedPositionByLeftBottomPoint,
} from '../shared/utils/getFixedPositionByWindow/index';
import { useHighlight } from './hook/useHighlight';
import { useFloatButtonState } from './hook/useFloatButtonState';
import { useJudgeIsTrigger } from '~contents/shared/hooks/JudgeIsTrigger';
import { OpenDisplayFrom } from './utils/type';
import { sendToBackground } from '@plasmohq/messaging';
import { storage } from '~contents/shared/utils/storageUtils';
import { useStorage } from '@plasmohq/storage/hook';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
};

// Inject into the ShadowDOM
export const getStyle = () => {
  const style = document.createElement('style');
  style.textContent = cssText;
  return style;
};

export const getInlineAnchor: PlasmoGetInlineAnchor = () => document.body;

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
      resp.message && setUnknownWordList(resp.message);
    })();
  }, []);
  return [UnKnownWordList, setUnknownWordList];
}

const Comp = () => {
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
            ...getFixedPositionByRightBottomPoint(56, 25, targetRect),
          }}
          onClick={() => {
            setFloatButtonVisible(false);
            setOpenDisplayFrom(OpenDisplayFrom.FloatBtn);
          }}
        >
          📝 翻译
        </button>
      )}
      <div
        ref={saveTrigger}
        style={{
          position: 'fixed',
          zIndex: '9999',
          ...getFixedPositionByLeftBottomPoint(400, 500, targetRect),
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
          openDisplayFrom={openDisplayFrom}
          UnKnownWordList={UnKnownWordList}
          selectedText={selectedText}
        />
      </div>
    </div>
  );
};

const PlasmoInline = () => {
  const [blacklistWeb, setBlacklistWeb] = useState([]);
  useEffect(() => {
    (async () => {
      const blacklist = (await storage.get('blacklistWeb')) as string[];
      setBlacklistWeb(blacklist);
    })();
  }, []);
  const isBan = blacklistWeb.some((l) => l === window.origin);
  return isBan ? <></> : <Comp />;
};
export default PlasmoInline;
