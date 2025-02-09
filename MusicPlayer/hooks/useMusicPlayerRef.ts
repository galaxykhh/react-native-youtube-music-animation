import { useRef } from 'react';
import { MusicPlayerHandler } from '..';

export const useMusicPlayerRef = () => {
    const ref = useRef<MusicPlayerHandler>();

    return ref;
}