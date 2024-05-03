import { event } from '~contents/shared/utils/event';

export function AddWordBookButton(props: {
  selectedText: string;
  UnKnownWordList: string[];
}) {
  const { selectedText, UnKnownWordList = [] } = props;
  const isAdd = UnKnownWordList?.some((w) => w === selectedText);
  return (
    <div
      className="noselect"
      style={{
        borderBottom: isAdd ? '1px dotted #00a792' : '1px dotted grey',
      }}
      onClick={() => {
        if (isAdd) {
          event.emit('delete_unknown', selectedText);
        } else {
          event.emit('add_unknown', selectedText);
        }
      }}
    >
      {isAdd ? '🟢 已加生词本' : '⚪️ 点击加生词'}
    </div>
  );
}
