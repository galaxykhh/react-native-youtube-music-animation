import { Easing } from 'react-native-reanimated';
import { w, h, sp } from '../styles/size';

export const FAST_VELOCITY_Y = 1000;
export const EASING_BEZIER = Easing.bezier(0.25, 0.5, 0, 1);
export const PLAYER_ANIMATION_DURATION = 500;
export const BODY_ALBUM_SIZE = w(310);
export const BODY_ALBUM_PADDING_HORIZONTAL = (sp(375) - BODY_ALBUM_SIZE) / 2;
export const SHEET_HEADER_HEIGHT = h(70);