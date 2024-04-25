import {
  OpenDisplayFrom,
  type IWordDetail,
} from '~contents/highlight/utils/type';
import { useState, type ReactNode, useEffect, useRef } from 'react';
import { sendToBackground } from '@plasmohq/messaging';
import { AddWordBookButton } from '../AddWordBookButton';
import {
  AudioPlayStatus,
  useAudioState,
} from '~contents/shared/hooks/useAudioState';

enum UseWhichDisplay {
  WordDetail,
  Translation,
  Unknow,
}

const pronouncesItem = (w, i) => {
  const { audioRef, playStatus } = useAudioState();
  const onClick = (word, type) => {
    audioRef.current.src = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=${type === 'UK' ? 1 : 2}`;
    audioRef.current.play();
  };
  const AudioStatusClassName =
    'pronounces_audio_status' +
    (playStatus === AudioPlayStatus.Loading
      ? ' pronounces_audio_status_loading'
      : '') +
    (playStatus === AudioPlayStatus.Play
      ? ' pronounces_audio_status_play'
      : '') +
    (playStatus === AudioPlayStatus.Error
      ? ' pronounces_audio_status_error'
      : '');
  return (
    <div
      className="pronounces_item"
      onClick={() => {
        onClick(w, i.type);
      }}
    >
      {i.type === 'US' ? '美' : '英'} {i.phonetic ? `/${i.phonetic}/` : ''}
      <div className={AudioStatusClassName}></div>
    </div>
  );
};

const pronounces = (d: IWordDetail) => {
  return (
    <div className="pronounces_list">
      {d.pronounces?.map((i) => {
        return pronouncesItem(d.word, i);
      })}
    </div>
  );
};

const explain_list = (d: IWordDetail) => {
  return (
    <div className="explain_list">
      {d.explain_list?.map((i) => {
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
            const { audioRef, playStatus } = useAudioState();
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

            const onClick = (word, type) => {
              audioRef.current.src = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=${type === 'UK' ? 1 : 2}`;
              audioRef.current.play();
            };

            const AudioStatusClassName =
              'sentence_audio_status' +
              (playStatus === AudioPlayStatus.Loading
                ? ' pronounces_audio_status_loading'
                : '') +
              (playStatus === AudioPlayStatus.Play
                ? ' pronounces_audio_status_play'
                : '') +
              (playStatus === AudioPlayStatus.Error
                ? ' pronounces_audio_status_error'
                : '');

            // 添加剩余文本
            highlightedText.push(
              <span key={i.text_indexes.length}>
                {i.text.slice(currentIndex)}
              </span>,
            );

            return (
              <div className="sentences_list_container">
                <div className="sentences_list_item">
                  <div className="sentences_list_item_text">
                    <div className="sentences_list_item_dottt">💬</div>
                    {highlightedText}
                  </div>
                  <div className="sentences_list_item_tran">{i.tran}</div>
                </div>
                <div
                  onClick={() => onClick(i.text, 'UK')}
                  className={AudioStatusClassName}
                >
                  🦻🏻
                </div>
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
      {d.forms?.map((i) => {
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

function useGetDetail(props: {
  selectedText: string;
  openDisplayFrom: OpenDisplayFrom;
}): IWordDetail[] | undefined {
  const { selectedText, openDisplayFrom } = props;
  const [detail, setDetail] = useState(undefined);
  useEffect(() => {
    if (!selectedText || openDisplayFrom === OpenDisplayFrom.Close) {
      return;
    }
    const containerRef = document.getElementById('word-display-container');
    containerRef?.scrollTo(0, 0);
    (async () => {
      const resp = await sendToBackground({
        name: 'searchWordDetailInfo',
        body: {
          input: selectedText,
        },
      });
      setDetail(resp.message || []);
    })();
  }, [selectedText, openDisplayFrom]);

  return detail;
}

function useGetGoogleTranslation(
  selectedText: string,
  openDisplayFrom: OpenDisplayFrom,
): string {
  const [trainslation, setTrainslation] = useState('');
  useEffect(() => {
    if (!selectedText || openDisplayFrom !== OpenDisplayFrom.FloatBtn) {
      setTrainslation('');
      return;
    }
    (async () => {
      const resp = await sendToBackground({
        name: 'googleTranslate',
        body: {
          selectedText,
          option: { to: 'zh-cn' },
        },
      });
      console.log('useGetGoogleTranslation', resp.message);
      resp.message && setTrainslation(resp.message.text);
    })();
  }, [selectedText, openDisplayFrom]);
  return trainslation;
}

function WordDisplay(props: {
  selectedText: string;
  UnKnownWordList: string[];
  detail: IWordDetail[] | undefined;
}): ReactNode {
  const { selectedText, UnKnownWordList, detail = [] } = props;
  return (
    <div className="display-container" id="word-display-container">
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

function TranslationDisplay(props: { trainslation: string }): ReactNode {
  const { trainslation } = props;
  return (
    <div className="display-container">
      <div className="translation-detail-content">
        {/* <div className="translation-before-text">{selectedText}</div>
        <div className="translation-line"></div> */}
        <div className="translation-after-text">
          {/* <div className="translation-after-text-loading"></div> */}
          {trainslation ? (
            trainslation
          ) : (
            <div className="translation-after-text-loading"></div>
          )}
        </div>
      </div>
      <div className="translation-reference">
        Powered By <span style={{ color: '#4286F3' }}>G</span>
        <span style={{ color: '#EB4537' }}>o</span>
        <span style={{ color: '#FAC230' }}>o</span>
        <span style={{ color: '#4286F3' }}>g</span>
        <span style={{ color: '#55AF7B' }}>l</span>
        <span style={{ color: '#EB4537' }}>e</span> Translation ⚡️
      </div>
    </div>
  );
}

function useDisplayData(props: {
  selectedText: string;
  openDisplayFrom: OpenDisplayFrom;
}): {
  detail: IWordDetail[] | undefined;
  trainslation: string;
  useWhichDisplay: UseWhichDisplay;
} {
  const { selectedText, openDisplayFrom } = props;
  const trainslation = useGetGoogleTranslation(selectedText, openDisplayFrom);
  const detail = useGetDetail({
    selectedText,
    openDisplayFrom,
  });
  const [useWhichDisplay, setUseWhichDisplay] = useState(
    UseWhichDisplay.Unknow,
  );

  useEffect(() => {
    if (openDisplayFrom === OpenDisplayFrom.Close) {
      setUseWhichDisplay(UseWhichDisplay.Unknow);
    }
  }, [openDisplayFrom]);

  useEffect(() => {
    if (Array.isArray(detail)) {
      if (detail.length) {
        setUseWhichDisplay(UseWhichDisplay.WordDetail);
      } else {
        setUseWhichDisplay(UseWhichDisplay.Translation);
      }
    }
  }, [detail]);

  return {
    trainslation,
    detail,
    useWhichDisplay,
  };
}

export function Display(props: {
  selectedText: string;
  UnKnownWordList: string[];
  openDisplayFrom: OpenDisplayFrom;
}): ReactNode {
  const { selectedText, UnKnownWordList, openDisplayFrom } = props;
  const { trainslation, detail, useWhichDisplay } = useDisplayData({
    selectedText,
    openDisplayFrom,
  });
  if (useWhichDisplay === UseWhichDisplay.Unknow) {
    return <></>;
  } else if (useWhichDisplay === UseWhichDisplay.Translation) {
    return <TranslationDisplay trainslation={trainslation} />;
  } else {
    return (
      <WordDisplay
        detail={detail}
        UnKnownWordList={UnKnownWordList}
        selectedText={selectedText}
      />
    );
  }
}
