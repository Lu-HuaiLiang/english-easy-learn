import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from 'plasmo';
import cssText from 'data-text:./index.css';
import { useRef, useState } from 'react';
import { Display } from '~contents/highlight/components/Display';
import {
  getFixedPositionByRightBottomPoint,
  getFixedPositionByLeftBottomPoint,
} from '../shared/utils/getFixedPositionByWindow/index';
import { useFloatButtonState } from './hook/useFloatButtonState';
import { useJudgeIsTrigger } from '~contents/shared/hooks/JudgeIsTrigger';
import { OpenDisplayFrom } from './utils/type';
import { usePass } from '~contents/shared/hooks/useBan';
import {
  AudioPlayStatus,
  useAudioState,
} from '~contents/shared/hooks/useAudioState';
import { ErrorBoundary } from '~contents/shared/components/ErrorBoundary';
import { useHighlight } from './hook/useHighlight';
import { useGetUnKnownWordList } from '~contents/shared/utils/storageUtils/word';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
};

// Inject into the ShadowDOM
export const getStyle = () => {
  const style = document.createElement('style');
  style.textContent = cssText;
  return style;
};

export const getInlineAnchor: PlasmoGetInlineAnchor = () => document.body;

export const getShadowHostId = () => 'plasmo-inline-example-unique-id';

function AudioButton(props: any) {
  const { selectedText, type } = props;
  const { audioRef, playStatus } = useAudioState();
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
    <button
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        border: 'none',
        cursor: 'pointer',
        padding: '0 7px',
        borderRight: 'solid 1px rgb(156 154 154)',
        borderRadius: type == 'UK' ? '4px 0px 0px 4px' : '0px',
      }}
      onClick={() => {
        audioRef.current.src = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(selectedText)}&type=${type === 'UK' ? 1 : 2}`;
        audioRef.current.play();
      }}
    >
      📻 {type === 'US' ? '美' : '英'}
      <div className={AudioStatusClassName}></div>
    </button>
  );
}

const Comp = () => {
  const [selectedText, setSelectedText] = useState('');
  const [openDisplayFrom, setOpenDisplayFrom] = useState(OpenDisplayFrom.Close);
  const [targetRect, setTargetRect] = useState<DOMRect | undefined>();
  // const [UnKnownWordList, setUnknownWordList] = useGetUnKnownWordList();
  const [UnKnownWordList, setUnknownWordList] = useGetUnKnownWordList();
  const { saveTrigger, isTrigger } = useJudgeIsTrigger();
  const [floatButtonVisible, setFloatButtonVisible] = useState(false);
  const leaveHighlightTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useFloatButtonState({
    floatButtonVisible,
    setFloatButtonVisible,
    isTrigger,
    openDisplayFrom,
    setOpenDisplayFrom,
    setSelectedText,
    setTargetRect,
  });

  useHighlight({
    leaveHighlightTimerRef,
    UnKnownWordList,
    setUnknownWordList,
    setTargetRect,
    setOpenDisplayFrom,
    setSelectedText,
    setFloatButtonVisible,
  });

  return (
    <div>
      {floatButtonVisible && (
        <div
          ref={saveTrigger}
          style={{
            borderRadius: '4px',
            border: 'solid 1px rgb(156 154 154)',
            display: 'flex',
            position: 'fixed',
            zIndex: '9999',
            height: '24px',
            background: 'buttonface',
            ...getFixedPositionByRightBottomPoint(177, 25, targetRect),
          }}
        >
          <AudioButton selectedText={selectedText} type="UK" />
          <AudioButton selectedText={selectedText} type="US" />
          <button
            style={{
              border: 'none',
              borderRadius: '0px 4px 4px 0px',
              cursor: 'pointer',
            }}
            onClick={() => {
              setFloatButtonVisible(false);
              setOpenDisplayFrom(OpenDisplayFrom.FloatBtn);
            }}
          >
            📝 翻译
          </button>
        </div>
      )}
      <div
        ref={saveTrigger}
        style={{
          position: 'fixed',
          zIndex: '9999',
          ...getFixedPositionByLeftBottomPoint(400, 500, targetRect),
          visibility:
            openDisplayFrom !== OpenDisplayFrom.Close ? 'visible' : 'hidden',
        }}
        onMouseEnter={() => {
          setFloatButtonVisible(false);
          leaveHighlightTimerRef.current &&
            clearTimeout(leaveHighlightTimerRef.current);
        }}
        onMouseLeave={() => {
          openDisplayFrom === OpenDisplayFrom.Highlight &&
            setOpenDisplayFrom(OpenDisplayFrom.Close);
        }}
      >
        <Display
          openDisplayFrom={openDisplayFrom}
          UnKnownWordList={UnKnownWordList}
          selectedText={selectedText}
        />
      </div>
    </div>
  );
};

const PlasmoInline = () => {
  const isPass = usePass();
  return <ErrorBoundary>{isPass ? <Comp /> : <></>}</ErrorBoundary>;
};
export default PlasmoInline;
