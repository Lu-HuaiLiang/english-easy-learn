import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from 'plasmo';
import cssText from 'data-text:./index.css';
import { sendToBackground } from '@plasmohq/messaging';
import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import findTargetTextNode from './utils/highlightUtils/findNode';
import { wordbook } from './store';
import { Display } from '~contents/floatBtn/components/Display';
import { getFixedPostion } from '../shared/utils/index';
import { event } from '~contents/shared/utils/event';

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

const PlasmoInline = () => {
  const [selectedText, setSelectedText] = useState('');
  const [displayVisible, setDisplayVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | undefined>();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  // const [UnKnowWordList, setUnknowWordList] = useState(wordbook);

  // useEffect(() => {
  //   event.on('update', () => {});
  // }, []);

  useEffect(() => {
    (async () => {
      const nodes = await findTargetTextNode(
        wordbook.map((item) => ({ text: item })),
      );
      handleHighlighter(nodes);
    })();
  }, [wordbook]);

  const handleHighlighter = (nodes) => {
    nodes.forEach((it) => {
      const markWrap = document.createElement('xmark');
      const t = document.createElement('xmark');
      markWrap.appendChild(it.node.cloneNode(false));
      markWrap.setAttribute(
        'style',
        'color: blue; cursor: pointer; white-space: nowrap;',
        // 'border-bottom: 1px dashed #3BC168; cursor: pointer; white-space: nowrap;',
      );
      t.setAttribute(`data-text`, it.material.text);
      t.setAttribute(`data-marked`, 'true');
      t.appendChild(markWrap);
      it.node.replaceWith(t);

      t.addEventListener('mouseenter', () => {
        clearTimeout(timerRef.current);
        setTargetRect(t.getBoundingClientRect());
        setSelectedText(it.material.text);
        setDisplayVisible(true);
      });
      t.addEventListener('mouseleave', (e) => {
        timerRef.current = setTimeout(() => {
          setDisplayVisible(false);
        }, 500);
      });
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: '9999',
        ...getFixedPostion(400, 500, targetRect),
        visibility: displayVisible ? 'visible' : 'hidden',
      }}
      onMouseEnter={() => {
        clearTimeout(timerRef.current);
      }}
      onMouseLeave={() => {
        setDisplayVisible(false);
      }}
    >
      <Display selectedText={selectedText} />
    </div>
  );
};

export default PlasmoInline;
