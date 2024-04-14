import { wordbook } from '~contents/highlight/store';

export function AddWordBookButton(props: { selectedText: string }) {
  const { selectedText } = props;
  const isAdd = wordbook.some((w) => w === selectedText);
  return <div>{isAdd ? '✅ 已加入单词本' : '⏏️ 加入单词本'}</div>;
}
