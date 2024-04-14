import { useRef } from 'react';

export function useJudgeIsTrigger() {
  const triggerNodeSet = useRef<Set<HTMLElement>>(new Set());
  const saveTrigger = (node: HTMLElement | null) => {
    if (node) {
      triggerNodeSet.current!.add(node);
    }
  };
  const isTrigger = (dom: any) =>
    Array.from(triggerNodeSet.current).some(
      (node) => dom?.contains(node) || dom?.shadowRoot?.contains(node),
    );
  return {
    saveTrigger,
    isTrigger,
  };
}
