import { useRef } from 'react';
import { MusicPlayerHandler } from './MusicPlayer';

export const useMusicPlayerRef = () => {
    const ref = useRef<MusicPlayerHandler>();

    return ref;
}