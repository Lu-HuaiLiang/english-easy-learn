import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from 'plasmo';
import cssText from 'data-text:~/contents/search/search.css';
import { sendToBackground } from '@plasmohq/messaging';
import { useEffect, useState } from 'react';
import findTargetTextNode from './utils/highlightUtils/findNode';

export const config: PlasmoCSConfig = {
  matches: ['https://mp.weixin.qq.com/*'],
};

// Inject into the ShadowDOM
export const getStyle = () => {
  const style = document.createElement('style');
  style.textContent = cssText;
  return style;
};

const handleHighlighter = (nodes) => {
  nodes.forEach((it) => {
    const markWrap = document.createElement('xmark');
    const t = document.createElement('xmark');
    markWrap.appendChild(it.node.cloneNode(false));
    markWrap.setAttribute(
      'style',
      'border-bottom: 1px dashed #3BC168; cursor: pointer; white-space: nowrap;',
    );
    t.setAttribute(`data-text`, it.material.text);
    t.setAttribute(`data-marked`, 'true');
    t.appendChild(markWrap);

    // let clearTime;
    // t.addEventListener('mouseenter', () => {
    //   clearTimeout(clearTime);
    //   const tipDom = axTip.render(t.getBoundingClientRect());
    //   tipDom &&
    //     tipDom.addEventListener('mouseleave', () => {
    //       axTip.clear();
    //     });
    // });
    // t.addEventListener('mouseleave', (e) => {
    //   clearTime = setTimeout(() => {
    //     axTip.clear();
    //   }, 20000);
    //   axTip.clear();
    // });
    it.node.replaceWith(t);
  });
};

export function useHighlightText() {
  useEffect(() => {
    (async () => {
      const nodes = await findTargetTextNode([
        { text: 'Hillary' },
        { text: 'started' },
      ]);
      handleHighlighter(nodes);
    })();
  }, []);
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () => document.body;

// Use this to optimize unmount lookups
export const getShadowHostId = () => 'plasmo-inline-example-unique-id';

const PlasmoInline = () => {
  useHighlightText();
  return <></>;
};

export default PlasmoInline;
