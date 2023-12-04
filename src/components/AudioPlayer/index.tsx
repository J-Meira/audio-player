import { useEffect, useRef, useState } from 'react';

import {
  Box,
  Card,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  Switch,
  Typography,
} from '@mui/material';
import {
  MdPlayArrow as PlayIcon,
  MdPause as PauseIcon,
  MdVolumeOff as VolumeOffIcon,
  MdVolumeUp as VolumeUpIcon,
} from 'react-icons/md';

import { IAudioPlayerProps } from '../../types';

export const AudioPlayer = ({
  src,
  autoPlay,
  toggleAutoPlay,
}: IAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const getTime = (type: 'current' | 'total'): string => {
    if (!audioRef.current) return '00:00';
    const time =
      type === 'current'
        ? audioRef.current.currentTime
        : audioRef.current.duration;

    const minutes = Math.floor(time / 60);
    const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(time % 60);
    const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${formatMinutes}:${formatSeconds}`;
  };

  const pause = () => {
    setIsPlaying(false);
    audioRef.current?.pause();
  };

  const play = () => {
    setIsPlaying(true);
    audioRef.current?.play();
  };

  useEffect(() => {
    window.addEventListener('blur', pause);
    window.addEventListener('focus', play);

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }

    // eslint-disable-next-line
  }, [isMuted]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (audioRef.current) {
        const { duration, currentTime } = audioRef.current;
        const progressTime = (currentTime * 100) / duration;
        setProgress(progressTime);
        if (progressTime === 100) {
          pause();
        }
      }
    }, 100);
    return () => {
      clearInterval(timer);
    };

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (autoPlay) {
      play();
    }

    // eslint-disable-next-line
  }, [src, autoPlay]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sx={{ height: 200 }}></Grid>
      <Grid item xs={12} md={4}></Grid>
      <Grid item xs={12} md={4}>
        <Card className='player-card' elevation={4}>
          <IconButton onClick={togglePlay} className='player-button'>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </IconButton>
          <Box className='player-progress'>
            <Box className='player-timers'>
              <Typography variant='caption'>
                {getTime('current')}
              </Typography>
              <Typography variant='caption'>{getTime('total')}</Typography>
            </Box>
            <LinearProgress variant='determinate' value={progress} />
            <Box className='player-timers'>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoPlay}
                    onChange={() => toggleAutoPlay()}
                  />
                }
                label='Auto Play'
              />
              <IconButton onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </IconButton>
            </Box>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}></Grid>
      <Grid item xs={12} sx={{ height: 200 }}></Grid>
      <audio src={src} ref={audioRef} />
    </Grid>
  );
};
