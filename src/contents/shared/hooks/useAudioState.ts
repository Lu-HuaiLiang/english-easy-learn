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
        setPlayStatus(AudioPlayStatus.NotYet);
      }
    };
    event.on('audio:stop', stop);
    audioRef.current.onloadstart = function () {
      event.emit('audio:stop', audioRef.current);
      setPlayStatus(AudioPlayStatus.Loading);
    };
    audioRef.current.onloadeddata = function () {
      setPlayStatus(AudioPlayStatus.Play);
    };
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
