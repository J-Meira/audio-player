import { useState } from 'react';
import { FormControlLabel, Paper, Switch } from '@mui/material';

import { AudioPlayer, useThemeContext } from './components';

import demoMp3 from './demo.mp3';

export const App = () => {
  const { dark, onChangeMode } = useThemeContext();
  const [autoPlay, setAutoPlay] = useState(false);

  return (
    <Paper square className='app'>
      <AudioPlayer
        src={demoMp3}
        autoPlay={autoPlay}
        toggleAutoPlay={() => setAutoPlay(!autoPlay)}
      />
      <FormControlLabel
        sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        control={<Switch checked={dark} onChange={() => onChangeMode()} />}
        label={dark ? 'DARK' : 'LIGHT'}
      />
    </Paper>
  );
};
