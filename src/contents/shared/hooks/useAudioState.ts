import exp from 'constants';
import { useEffect, useRef, useState } from 'react';
import { event } from '../utils/event';

export enum AudioPlayStatus {
  NotYet,
  Loading,
  Play,
  Error,
}

export function useAudioState() {
  const audioRef = useRef(new Audio());
  const [playStatus, setPlayStatus] = useState(AudioPlayStatus.NotYet);

  useEffect(() => {
    const stop = (self) => {
      if (self !== audioRef.current) {
        audioRef.current.pause();
      }
    };
    event.on('audio:stop', stop);
    audioRef.current.onloadstart = function () {
      setPlayStatus(AudioPlayStatus.Loading);
      event.emit('audio:stop', audioRef.current);
    };
    audioRef.current.addEventListener('timeupdate', () => {
      const currentTime = audioRef.current.currentTime; // 获取当前播放时间（以秒为单位）
      if (currentTime) {
        setPlayStatus(AudioPlayStatus.Play);
      }
    });
    audioRef.current.addEventListener('pause', () => {
      setPlayStatus(AudioPlayStatus.NotYet);
    });
    audioRef.current.addEventListener('abort', function () {
      setPlayStatus(AudioPlayStatus.NotYet);
    });
    audioRef.current.addEventListener('ended', () => {
      setPlayStatus(AudioPlayStatus.NotYet);
    });
    audioRef.current.addEventListener('error', () => {
      setPlayStatus(AudioPlayStatus.Error);
    });
    return () => {
      event.emit('audio:stop');
      event.off('audio:stop', stop);
    };
  }, []);

  return { audioRef, playStatus };
}
