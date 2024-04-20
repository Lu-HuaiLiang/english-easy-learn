import { useEffect, useState } from 'react';
import { OpenDisplayFrom } from '../utils/type';

export function useFloatButtonState(props: any) {
  const {
    floatButtonVisible,
    setFloatButtonVisible,
    isTrigger,
    openDisplayFrom,
    setOpenDisplayFrom,
    setSelectedText,
    setTargetRect,
  } = props;

  useEffect(() => {
    const closeDropdown = (event: MouseEvent) => {
      if (floatButtonVisible && !isTrigger(event.target)) {
        setFloatButtonVisible(false);
      }
      if (
        openDisplayFrom === OpenDisplayFrom.FloatBtn &&
        !isTrigger(event.target)
      ) {
        setOpenDisplayFrom(OpenDisplayFrom.Close);
      }
    };
    window.addEventListener('click', closeDropdown);
    return function cleanup() {
      window.removeEventListener('click', closeDropdown);
    };
  }, [floatButtonVisible, openDisplayFrom]);

  useEffect(() => {
    document.body.style.position = 'relative';
    const handleSelection = (event) => {
      if (isTrigger(event.target)) {
        return;
      }
      const selection = window.getSelection();
      const selectedString = selection.toString().trim();
      if (selectedString !== '') {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectedText(selectedString);
        setTargetRect(rect);
        setFloatButtonVisible(true);
      }
    };
    document.addEventListener('dblclick', handleSelection);
    return () => document.removeEventListener('dblclick', handleSelection);
  }, []);

  return {
    floatButtonVisible,
    setFloatButtonVisible,
  };
}
