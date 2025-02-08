import { useCallback, useState } from 'react';
import TrackPlayer, { Event, useTrackPlayerEvents } from 'react-native-track-player';
import { Track } from './MusicPlayer';

enum PlaybackState {
    loading = 'loading',
    paused = 'paused',
    ready = 'ready',
    buffering = 'buffering',
    playing = 'playing',
    ended = 'ended',
}

type UseTrackHooks = {
    queue: Track[];
    index: number;
    isPlaying: boolean;
    isShuffle: boolean;
    isRepeat: boolean;
    canSkipBack: boolean;
    canSkipForward: boolean;
    setIndex: (index: number) => void;
    addTrack: (track: Track) => Promise<void>;
    addTrackAndPlay: (track: Track) => Promise<void>;
    play: () => void;
    pause: () => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
    skip: (index: number) => Promise<void>;
    skipBack: () => Promise<void>;
    skipForward: () => Promise<void>;
};

const events: Event[] = [
    Event.PlaybackState,
    Event.PlaybackQueueEnded,
    Event.PlaybackActiveTrackChanged,
];

export const useTrack = (): UseTrackHooks => {
    const [queue, setQueue] = useState<Track[]>([]);
    const [index, setIndex] = useState<number>(0);
    const [playbackState, setPlaybackState] = useState<PlaybackState>(PlaybackState.loading);
    const [isShuffle, setIsShuffle] = useState<boolean>(false);
    const [isRepeat, setIsRepeat] = useState<boolean>(false);

    const isPlaying = playbackState === PlaybackState.playing;
    const canSkipBack = index > 0;
    const canSkipForward = index < queue.length - 1;

    const play = async () => {
        if (playbackState === PlaybackState.ended) {
            const index = await TrackPlayer.getActiveTrackIndex()
            await TrackPlayer.skip(index);
        }

        TrackPlayer.play();
    };

    const pause = useCallback(() => {
        TrackPlayer.pause();
    }, []);

    const addTrack = async (track: Track) => {
        const currentQueue = await TrackPlayer.getQueue();
        const isInQueue = currentQueue.some(t => t.url === track.url);
        if (!isInQueue) {
            await TrackPlayer.add(track);
            setQueue(_ => [...currentQueue as Track[], track]);
        }
    };

    const addTrackAndPlay = async (track: Track) => {
        await addTrack(track);
        await TrackPlayer.skipToNext();
        play();
    };

    const skip = useCallback(async (index: number) => {
        await TrackPlayer.skip(index);
        setIndex(index);
        TrackPlayer.play();
    }, []);

    const skipBack = useCallback(async () => {
        await TrackPlayer.skipToPrevious();
    }, []);

    const skipForward = useCallback(async () => {
        await TrackPlayer.skipToNext();
    }, []);

    const toggleShuffle = useCallback(() => {
        setIsShuffle(prev => !prev);
    }, []);

    const toggleRepeat = useCallback(() => {
        setIsRepeat(prev => !prev);
    }, []);

    useTrackPlayerEvents(events, async (event) => {
        if (event.type === Event.PlaybackError) {
            console.warn('An error occurred while playing the current track.');
        }

        if (event.type === Event.PlaybackActiveTrackChanged) {
            const updatedQueue = await TrackPlayer.getQueue();
            setQueue(updatedQueue as Track[]);

            if (event.index !== undefined) {
                setIndex(event.index);
            }
        }

        if (event.type === Event.PlaybackState) {
            const containsState = Object.keys(PlaybackState).includes(event.state);
            containsState && setPlaybackState(PlaybackState[event.state]);
        }
    });

    return {
        queue,
        index,
        isPlaying,
        isShuffle,
        isRepeat,
        canSkipBack,
        canSkipForward,
        setIndex,
        addTrack,
        addTrackAndPlay,
        play,
        pause,
        toggleShuffle,
        toggleRepeat,
        skip,
        skipBack,
        skipForward,
    };
};
