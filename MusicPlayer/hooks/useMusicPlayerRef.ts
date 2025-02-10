import { MutableRefObject, useRef } from 'react';
import { MusicPlayerHandler } from '..';

type UseMusicPlayerRefHooks = MutableRefObject<MusicPlayerHandler>;

export const useMusicPlayerRef = (): UseMusicPlayerRefHooks => useRef<MusicPlayerHandler>();