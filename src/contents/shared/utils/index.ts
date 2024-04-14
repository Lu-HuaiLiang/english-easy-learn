export function getFixedPostion(
    floatWidth: number,
    floatHeight: number,
    rect?: DOMRect,
  ) {
    if (!rect) {
      return {};
    }
  
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const { top, bottom, right, left } = rect;
    const window_element_right_distance = viewportWidth - right;
    const window_element_bottom_distance = viewportHeight - bottom;
    if (
      window_element_right_distance < floatWidth &&
      window_element_bottom_distance < floatHeight
    ) {
      return {
        bottom: viewportHeight - top,
        right: viewportWidth - right,
      };
    } else if (
      window_element_right_distance > floatWidth &&
      window_element_bottom_distance > floatHeight
    ) {
      return {
        top: bottom,
        left,
      };
    } else if (
      window_element_right_distance < floatWidth &&
      window_element_bottom_distance > floatHeight
    ) {
      return {
        top: bottom,
        right: viewportWidth - right,
      };
    } else if (
      window_element_right_distance > floatWidth &&
      window_element_bottom_distance < floatHeight
    ) {
      return {
        bottom: viewportHeight - top,
        left,
      };
    } else {
      return {
        bottom: viewportHeight - top,
        right: viewportWidth - right,
      };
    }
  }