import { useCallback, useState } from 'react';

type UsePlayerStateHooks = {
    isPlaying: boolean;
    isShuffle: boolean;
    isRepeat: boolean;
    play: () => void;
    pause: () => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
};

export const usePlayerState = (): UsePlayerStateHooks => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isShuffle, setIsShuffle] = useState<boolean>(false);
    const [isRepeat, setIsRepeat] = useState<boolean>(false);
    const [progress, setProgress] = useState();

    const play = useCallback(() => {
        setIsPlaying(true);
    }, []);

    const pause = useCallback(() => {
        setIsPlaying(false);
    }, []);

    const toggleShuffle = useCallback(() => {
        setIsShuffle(isShuffle => !isShuffle);
    }, []);

    const toggleRepeat = useCallback(() => {
        setIsRepeat(isRepeat => !isRepeat);
    }, []);

    return {
        isPlaying,
        isShuffle,
        isRepeat,
        play,
        pause,
        toggleShuffle,
        toggleRepeat,
    }
}