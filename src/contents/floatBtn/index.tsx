import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from 'plasmo';
import cssText from 'data-text:./index.css';
import { sendToBackground } from '@plasmohq/messaging';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { IWordDetail } from './utils/type';
import { Display } from './components/Display';
import { getFixedPostion } from './utils/index';

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

const PlasmoInline = () => {
  const [selectedText, setSelectedText] = useState('');
  const [buttonVisible, setButtonVisible] = useState(false);
  const [displayVisible, setDisplayVisible] = useState(false);
  const triggerNodeSet = useRef<Set<HTMLElement>>(new Set());
  const [targetRect, setTargetRect] = useState<DOMRect | undefined>();

  const saveTrigger = (node: HTMLElement | null) => {
    if (node) {
      triggerNodeSet.current!.add(node);
    }
  };

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
        setTargetRect(rect);
        setButtonVisible(true);
      }
    };
    document.addEventListener('dblclick', handleSelection);
    return () => document.removeEventListener('dblclick', handleSelection);
  }, [displayVisible]);

  const handleClick = () => {
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
            ...getFixedPostion(56, 25, targetRect),
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
          ...getFixedPostion(400, 500, targetRect),
          visibility: displayVisible ? 'visible' : 'hidden',
        }}
        ref={saveTrigger}
      >
        <Display selectedText={selectedText} />
      </div>
    </div>
  );
};

export default PlasmoInline;
