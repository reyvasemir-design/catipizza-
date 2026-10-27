import React from 'react';
import {Composition} from 'remotion';
import {CatiPromo, TOTAL_FRAMES} from './CatiPromo';

export const Root: React.FC = () => (
  <Composition
    id="CatiPromo"
    component={CatiPromo}
    durationInFrames={TOTAL_FRAMES}
    fps={30}
    width={1080}
    height={1920}
  />
);

