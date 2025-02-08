import { useCallback, useState } from 'react';
import TrackPlayer, { Event, useTrackPlayerEvents } from 'react-native-track-player';
import { Track } from './MusicPlayer';

export enum PlaybackState {
    loading = 'loading',
    paused = 'paused',
    ready = 'ready',
    buffering = 'buffering',
    playing = 'playing',
    ended = 'ended',
}

export type UseTrackHooks = {
    queue: Track[];
    index: number;
    playbackState: PlaybackState;
    isShuffle: boolean;
    isRepeat: boolean;
    canSkipBack: boolean;
    canSkipForward: boolean;
    play: () => void;
    pause: () => void;
    playTrack: (track: Track) => Promise<void>;
    playTracks: (tracks: Track[]) => Promise<void>;
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

    const canSkipBack = index > 0;
    const canSkipForward = index < queue.length - 1;

    const play = useCallback(async () => {
        if (playbackState === PlaybackState.ended) {
            const index = await TrackPlayer.getActiveTrackIndex()
            await TrackPlayer.skip(index, 0);
        }

        TrackPlayer.play();
    }, [playbackState]);

    const pause = useCallback(() => {
        TrackPlayer.pause();
    }, []);

    const playTrack = async (track: Track) => {
        const currentQueue = await TrackPlayer.getQueue();

        if (currentQueue.length >= 1) {
            await TrackPlayer.reset();
        }

        await TrackPlayer.add(track);
        play();
    };

    const playTracks = async (tracks: Track[]) => {
        await TrackPlayer.reset();
        await TrackPlayer.add(tracks);

        play();
    }

    const skip = useCallback(async (index: number) => {
        await TrackPlayer.skip(index, 0);
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
        playbackState,
        isShuffle,
        isRepeat,
        canSkipBack,
        canSkipForward,
        play,
        pause,
        playTrack,
        playTracks,
        toggleShuffle,
        toggleRepeat,
        skip,
        skipBack,
        skipForward,
    };
};
