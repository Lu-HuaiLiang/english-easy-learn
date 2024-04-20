import { useEffect, useRef } from 'react';
import { event } from '~contents/shared/utils/event';
import findTargetTextNode from '../utils/highlightUtils/findNode';
import { OpenDisplayFrom } from '../utils/type';

export function useHighlight(props: any) {
  const {
    UnKnownWordList,
    setUnknownWordList,
    setTargetRect,
    setSelectedText,
    setOpenDisplayFrom,
  } = props;
  const leaveHighlightTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const deleteWordRef = useRef<string>('');
  const XmarkNodeMapRef = useRef(new Map());

  useEffect(() => {
    event.on('delete_unknown', (word) => {
      deleteWordRef.current = word;
      setUnknownWordList((words: string[]) => words.filter((w) => w !== word));
    });
    event.on('add_unknown', (word) => {
      setUnknownWordList((words: string[]) => words.concat(word));
    });
    return () => {
      event.off('delete_unknown');
      event.off('add_unknown');
    };
  }, []);

  const deleteHighlight = () => {
    if (!deleteWordRef.current) {
      return;
    }
    const del_nodes = XmarkNodeMapRef.current.get(deleteWordRef.current);
    del_nodes.forEach((n) => {
      const node = document.createTextNode(n.dataset.originText);
      n.replaceWith(node);
    });
    XmarkNodeMapRef.current.set(deleteWordRef.current, []);
    deleteWordRef.current = '';
  };

  useEffect(() => {
    (async () => {
      if (deleteWordRef.current) {
        deleteHighlight();
        return;
      }
      handleHighlighter(UnKnownWordList);
    })();
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
        'color: blue; cursor: pointer; white-space: nowrap;',
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
        const selection = window.getSelection();
        selection.removeAllRanges();
        clearTimeout(leaveHighlightTimerRef.current);
        setTargetRect(t.getBoundingClientRect());
        setSelectedText(it.material.text);
        setOpenDisplayFrom(OpenDisplayFrom.Highlight);
      });
      t.addEventListener('mouseleave', (e) => {
        leaveHighlightTimerRef.current = setTimeout(() => {
          setOpenDisplayFrom(OpenDisplayFrom.Close);
        }, 200);
      });
    });
  };

  return {
    leaveHighlightTimerRef,
  };
}
