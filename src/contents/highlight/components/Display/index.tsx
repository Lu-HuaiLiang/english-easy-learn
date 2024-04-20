import type { IWordDetail } from '~contents/highlight/utils/type';
import { useState, type ReactNode, useEffect, useRef } from 'react';
import { sendToBackground } from '@plasmohq/messaging';
import { AddWordBookButton } from '../AddWordBookButton';

const pronounces = (d: IWordDetail) => {
  return (
    <div className="pronounces_list">
      {d.pronounces.map((i) => {
        return (
          <span className="pronounces_item">
            {i.type === 'US' ? '美' : '英'}{' '}
            {i.phonetic ? `/${i.phonetic}/` : ''}
          </span>
        );
      })}
    </div>
  );
};

const explain_list = (d: IWordDetail) => {
  return (
    <div className="explain_list">
      {d.explain_list.map((i) => {
        return (
          <div className="explain_list_item">
            {i.pos && <div className="explain_list_pos">{i.pos}</div>}
            <div className="explain_list_meaning">{i.meaning}</div>
          </div>
        );
      })}
    </div>
  );
};

const sentences = (d: IWordDetail) => {
  return (
    <>
      {d.sentences && d.sentences.length && (
        <div className="sentences_title">🍊 Sentences</div>
      )}
      <div className="sentences_list">
        {d.sentences &&
          d.sentences?.map((i) => {
            let currentIndex = 0;
            const highlightedText = i.text_indexes.map(
              ({ start, end }, index) => {
                const nonHighlightedText = i.text.slice(currentIndex, start);
                const highlighted = i.text.slice(start, end);
                currentIndex = end;

                return (
                  <span key={index}>
                    {nonHighlightedText}
                    <span style={{ color: 'yellow' }}>{highlighted}</span>
                  </span>
                );
              },
            );

            // 添加剩余文本
            highlightedText.push(
              <span key={i.text_indexes.length}>
                {i.text.slice(currentIndex)}
              </span>,
            );

            return (
              <div className="sentences_list_item">
                <div className="sentences_list_item_text">
                  <div className="sentences_list_item_dottt">▫️</div>
                  {highlightedText}
                </div>
                <div className="sentences_list_item_tran">{i.tran}</div>
              </div>
            );
          })}
      </div>
    </>
  );
};

const forms = (d: IWordDetail) => {
  return (
    <div className="forms_list">
      {d.forms.map((i) => {
        const p = i.split(' ');
        return (
          <div className="forms_list_item">
            <div className="forms_list_item_up">{p[1]}</div>
            <div className="forms_list_item_down">{p[0]}</div>
          </div>
        );
      })}
    </div>
  );
};

function useGetDetail(selectedText: string, containerRef: any): IWordDetail[] {
  const [detail, setDetail] = useState([]);

  useEffect(() => {
    if (!selectedText) {
      return;
    }
    containerRef?.current.scrollTo(0, 0);
    (async () => {
      const resp = await sendToBackground({
        name: 'searchWordDetailInfo',
        body: {
          input: selectedText,
        },
      });
      // console.log(resp.message);
      resp.message && setDetail(resp.message);
    })();
  }, [selectedText]);
  return detail;
}

export function Display(props: {
  selectedText: string;
  UnKnownWordList: string[];
}): ReactNode {
  const { selectedText, UnKnownWordList } = props;
  const containerRef = useRef<any>();
  const detail = useGetDetail(selectedText, containerRef);

  if (!selectedText) {
    return <></>;
  }

  return (
    <div className="display-container" ref={containerRef}>
      <div className="selection-display">
        {selectedText}
        <div className="display-container-tool">
          <AddWordBookButton
            UnKnownWordList={UnKnownWordList}
            selectedText={selectedText}
          />
        </div>
      </div>
      <div className="detail_content">
        {detail.map((d) => {
          return (
            <div className="">
              {pronounces(d)}
              {explain_list(d)}
              {sentences(d)}
              {forms(d)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
