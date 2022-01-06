import React from 'react';

import { Theme } from '@mui/material';
import { NebulaFighterTheme } from './schemes/NebulaFighterTheme';

export function themeCreator(theme: string): Theme {
  return themeMap[theme];
}

const themeMap: { [key: string]: Theme } = {
  NebulaFighterTheme
};
