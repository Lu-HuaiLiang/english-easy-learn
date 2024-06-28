import { useEffect, useRef } from 'react';
import { event } from '~contents/shared/utils/event';
import findTargetTextNode from '../utils/highlightUtils/findNode';
import { OpenDisplayFrom } from '../utils/type';

// this 这样写的原因：上下文保持：在某些情况下，函数可能需要在特定的上下文中执行（例如，当函数是某个对象的方法时）。使用 context 可以确保即使在回调中，函数也能在正确的上下文中执行。
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function useHighlight(props: any) {
  const {
    UnKnownWordList,
    setUnknownWordList,
    setTargetRect,
    setSelectedText,
    setOpenDisplayFrom,
    leaveHighlightTimerRef,
    setFloatButtonVisible,
  } = props;

  const deleteWordRef = useRef<string>('');
  const insertWordRef = useRef<string>('');
  const XmarkNodeMapRef = useRef(new Map());
  const enterHighlightTimeRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    event.on('delete_unknown', (word) => {
      deleteWordRef.current = word;
      setUnknownWordList(UnKnownWordList.filter((w) => w !== word));
    });
    event.on('add_unknown', (word) => {
      insertWordRef.current = word;
      setUnknownWordList(UnKnownWordList.concat(word));
    });
    return () => {
      event.off('delete_unknown');
      event.off('add_unknown');
    };
  }, [UnKnownWordList]);

  const deleteHighlight = (w) => {
    const del_nodes = XmarkNodeMapRef.current.get(w);
    del_nodes?.forEach((n) => {
      const node = document.createTextNode(n.dataset.originText);
      n.replaceWith(node);
    });
    XmarkNodeMapRef.current.set(deleteWordRef.current, []);
    deleteWordRef.current = '';
  };

  // useEffect(() => {
  //   const handle = throttle(() => handleHighlighter(UnKnownWordList), 1000);
  //   const observer = new MutationObserver((mutationsList) => {
  //     requestAnimationFrame(() => {
  //       for (const mutation of mutationsList) {
  //         console.log(mutation);
  //         if (mutation.addedNodes.length > 0) {
  //           console.log('A child node has been added or removed.');
  //           handle();
  //         }
  //       }
  //     });
  //   });
  //   const targetNode = document.body; // 指定要观察的节点
  //   observer.observe(targetNode, {
  //     attributes: true, // 观察属性变化
  //     childList: true, // 观察子节点的增减
  //     subtree: true, // 观察后代节点
  //   });
  //   return () => {
  //     observer.disconnect();
  //   };
  // });

  useEffect(() => {
    const listen = function (request) {
      if (request.url) {
        console.log('url change');
        handleHighlighter(UnKnownWordList);
      }
    };
    handleHighlighter(UnKnownWordList);
    chrome.runtime.onMessage.addListener(listen);
    return () => {
      chrome.runtime.onMessage.removeListener(listen);
    };
  }, [UnKnownWordList]);

  useEffect(() => {
    if (deleteWordRef.current) {
      deleteHighlight(deleteWordRef.current);
      return;
    } else if (insertWordRef.current) {
      handleHighlighter([insertWordRef.current]);
      insertWordRef.current = '';
    }
    // else {
    //   handleHighlighter(UnKnownWordList);
    // }
  }, [UnKnownWordList]);

  const handleHighlighter = async (words: string[]) => {
    const nodes = await findTargetTextNode(
      words.map((item) => ({ text: item })),
    );
    // 新增取消的高亮的逻辑
    nodes.forEach((it) => {
      const markWrap = document.createElement('xmark');
      const t = document.createElement('xmark');
      markWrap.appendChild(it.node.cloneNode(false));
      markWrap.setAttribute(
        'style',
        'color: #de008e; cursor: pointer; white-space: nowrap;',
        // 'border-bottom: 1px dashed #3BC168; cursor: pointer; white-space: nowrap;',
      );
      t.setAttribute(`data-text`, it.material.text);
      t.setAttribute(`data-marked`, 'true');
      t.setAttribute(`data-origin-text`, it.node.nodeValue);
      t.appendChild(markWrap);
      it.node.replaceWith(t);
      // 收集高亮节点，用于删除高亮
      XmarkNodeMapRef.current.set(
        it.material.text,
        XmarkNodeMapRef.current.get(it.material.text)
          ? XmarkNodeMapRef.current.get(it.material.text).concat(t)
          : [t],
      );
      t.addEventListener('mouseenter', () => {
        enterHighlightTimeRef.current = setTimeout(() => {
          setFloatButtonVisible(false);
          const selection = window.getSelection();
          selection.removeAllRanges();
          clearTimeout(leaveHighlightTimerRef.current);
          setTargetRect(t.getBoundingClientRect());
          setSelectedText(it.material.text);
          setOpenDisplayFrom(OpenDisplayFrom.Highlight);
        }, 300);
      });
      t.addEventListener('mouseleave', (e) => {
        clearTimeout(enterHighlightTimeRef.current);
        leaveHighlightTimerRef.current = setTimeout(() => {
          setOpenDisplayFrom(OpenDisplayFrom.Close);
        }, 200);
      });
    });
  };
}
