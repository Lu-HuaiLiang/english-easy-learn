import { useEffect } from 'react';
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
  }, [openDisplayFrom]);

  useEffect(() => {
    const handleSelection = (event) => {
      if (isTrigger(event.target)) {
        return;
      }
      const selection = window.getSelection();
      const selectedString = selection.toString().trim();
      if (selection && selection.toString().length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectedText(selectedString);
        setTargetRect(rect);
        setFloatButtonVisible(true);
      } else {
        setFloatButtonVisible(false);
      }
    };
    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  return {
    floatButtonVisible,
    setFloatButtonVisible,
  };
}
