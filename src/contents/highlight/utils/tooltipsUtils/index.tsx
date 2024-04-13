import React from 'react';
import ReactDOM from 'react-dom/client';

function setPos(boxWrap, rangeRect) {
  document.documentElement.appendChild(boxWrap);
  const containerWidth = boxWrap.offsetWidth;
  const rangeWidth = rangeRect.right - rangeRect.left;
  const left = rangeRect.left + window.scrollX;
  const top = rangeRect.top + window.scrollY;
  let containerLeft = left - (containerWidth - rangeWidth) / 2;

  // 确保容器不超出视口
  containerLeft = Math.max(
    window.scrollX,
    Math.min(
      containerLeft,
      window.scrollX + document.documentElement.clientWidth - containerWidth,
    ),
  );
  const clientHeight = Math.max(
    document.documentElement.clientHeight,
    document.body.clientHeight,
  );

  let pos;
  if (rangeRect.top >= 150) {
    pos = {
      left: containerLeft,
      bottom: clientHeight - top + 10,
    };
  } else {
    pos = {
      left: containerLeft,
      top: top + rangeRect.height + 12,
    };
  }

  boxWrap.style.left = `${pos.left}px`;
  boxWrap.style.bottom = `${pos.bottom}px`;
  boxWrap.style.top = `${pos.top}px`;
}

class AxTip {
  wrapName;
  constructor(wrapName) {
    this.wrapName = wrapName || 'bluesea-box-wrap';
  }
  render(rect) {
    if (!rect.top && !rect.left) {
      return;
    }
    const tipRoot = document.createElement('div');
    tipRoot.classList.add('bluesea', this.wrapName);
    tipRoot.style.position = 'absolute';
    tipRoot.style.zIndex = '2147483647';
    tipRoot.style.color = 'white';
    tipRoot.style.userSelect = 'none';
    tipRoot.style.width = '418px';
    tipRoot.style.paddingBottom = '20px';
    tipRoot.style.boxSizing = 'border-box';
    tipRoot.style.background = '#2a2c2f';
    tipRoot.style.color = '#fff';
    tipRoot.style.borderRadius = '12px';
    tipRoot.style.border = '1px solid rgba(255, 255, 255, 0.05)';
    tipRoot.style.padding = '12px';
    // makeTipEl(tipRoot, props, rect.top >= 150);
    setPos(tipRoot, rect);
    // console.log('11111');
    const root = ReactDOM.createRoot(tipRoot);
    root.render(<div>123</div>);
    return tipRoot;
  }
  clear() {
    const boxWraps = document.querySelectorAll(`.${this.wrapName}`);
    boxWraps.forEach((it) => {
      document.documentElement.removeChild(it);
    });
  }
}

export const axTip = new AxTip('');
