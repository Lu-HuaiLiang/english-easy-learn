const forLowerCase = (text) => {
  return text.toLowerCase();
};

const dFSTraverse = (rootNodes, result = [] as any[]) => {
  const roots = Array.from(rootNodes) as any;
  const isSpecialElements = (el) =>
    ['SCRIPT', 'STYLE', 'PRE', 'CODE'].includes(el.nodeName);
  while (roots.length) {
    const root = roots.shift();
    // 跳过特殊节点 script style之类的
    if (isSpecialElements(root)) {
      continue;
    }
    result.push(root);
    if (root.childNodes.length) {
      dFSTraverse(root.childNodes, result);
    }
  }
  return result;
};

// findTargetTextNode[dFSTraverse]
const findTargetTextNode = async (materialList) => {
  if (materialList.length === 0) {
    return [];
  }
  const els = dFSTraverse([document])
    .filter((el) => el.nodeType === 3) // 文本节点
    .filter((el) => el.nodeValue.trim())
    .filter((it) => !!it)
    .filter((it) => it.length > 3);

  // 找到包含特点文本的Node节点index
  const elIndexs = els
    .map((it) => it.nodeValue)
    .reduce((pre, cur, index) => {
      const hasExist = materialList.some((it) => {
        return forLowerCase(cur).includes(forLowerCase(it.text));
      });
      return hasExist ? [...pre, index] : pre;
    }, []);

  // 最终返回的时候，包含特定文本的分割后的TextNode节点
  return elIndexs
    .map((i) => els[i])
    .filter((el) => {
      return !(
        el.parentNode.nodeName === 'XMARK' && el.parentNode.dataset.marked
      );
    })
    .reduce((pre, curEl) => {
      // 一个元素内可能存在多个单词
      // 一个元素内可能存在，同一个单词出现多次，这时候如果第一次解析失败，react -> If you're using Preact or React.
      const materials = materialList.reduce((pre2, cur) => {
        const startIndex = forLowerCase(curEl.nodeValue).indexOf(
          forLowerCase(cur.text),
        );
        if (startIndex === -1) {
          return pre2;
        }

        // 检查单词是否重复出现在元素内
        let i = startIndex;
        let startIndexList = [i];
        while (i !== -1) {
          const index = forLowerCase(curEl.nodeValue)
            .slice(i + cur.text.length)
            .indexOf(forLowerCase(cur.text));
          if (index === -1) {
            i = -1;
          } else {
            i = i + cur.text.length + index;
            startIndexList.push(i);
          }
        }

        return [
          ...pre2,
          ...startIndexList.map((it) => ({
            ...cur,
            startIndex: it,
          })),
        ];
      }, []);

      if (!materials.length) {
        return pre;
      }

      // 先排序，按先后排序
      materials.sort((a, b) => {
        if (a.startIndex === b.startIndex) {
          // 存在覆盖叠加的情况， abc abcde，展示比较长的那个
          return b.text.length - a.text.length;
        }
        return a.startIndex - b.startIndex;
      });

      // 每次切割完需要更改节点，基于下一个去做切割，暂时不考虑特殊情况
      let nowEl = curEl;
      let resultNodes = [] as any;
      let preMate = {} as any;

      materials.forEach((it) => {
        const hanldeEl = (start) => {
          if (start === -1) {
            // 存在首尾相连的情况，第二个不展示
            return false;
          }
          // 防止将完整单词从中间切割
          const regex = /[A-Za-z]/;
          if (regex.test(nowEl.nodeValue[start - 1] || '')) {
            return false;
          }
          if (regex.test(nowEl.nodeValue[start + it.text.length] || '')) {
            return false;
          }
          /**
           * splitText 是 dom 的方法，splitText 是什么方法，有什么副作用吗？如何避免？
           */
          nowEl.splitText(start);
          const passedNode = nowEl.nextSibling;
          passedNode.splitText(it.text.length);
          // 切割完毕，在此处额外获取
          resultNodes.push({ node: passedNode, material: it });
          nowEl = passedNode.nextSibling;
          return true;
        };

        // 特殊情况处理，Preact or React.
        if (preMate.text === it.text && !preMate.isCut) {
          const index = forLowerCase(nowEl.nodeValue)
            .slice(preMate.start + it.text.length)
            .indexOf(forLowerCase(it.text));

          if (index === -1) {
            return;
          }

          preMate = {
            text: it.text,
            isCut: hanldeEl(preMate.start + it.text.length + index),
            start: index,
          };
          return;
        }

        let start = forLowerCase(nowEl.nodeValue).indexOf(
          forLowerCase(it.text),
        );

        preMate = {
          text: it.text,
          isCut: hanldeEl(start),
          start,
        };
      });

      return [...pre, ...resultNodes];
    }, []);
};

export default findTargetTextNode;