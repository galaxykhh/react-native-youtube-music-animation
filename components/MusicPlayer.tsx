import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, ListRenderItemInfo } from 'react-native';
import Animated, { runOnJS, SlideInDown, useAnimatedReaction } from 'react-native-reanimated';
import { GestureDetector, FlatList, ScrollView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import Header, { styles as headerStyles } from './Header';
import Capsule from './Capsule';
import Controller from './Controller';
import Toolbar from './Toolbar';
import ProgressBar from './ProgressBar';
import { BODY_ALBUM_PADDING_HORIZONTAL, BODY_ALBUM_SIZE } from './values';
import { colors } from '../styles/colors';
import { h, sp, w } from '../styles/size';
import { usePlayerAnimation } from './usePlayerAnimation';
import { usePlayerState } from './usePlayerState';

type AnimationState =
    | 'collapsed'
    | 'expanded'
    | 'fullyExpanded';

export type Track = {
    title: string;
    artist: string;
    artwork: string;
    artworkThumbnail: string;
    url: string;
    duration: number;
}

export type MusicPlayerProps = {
    tracks: Track[];
    initialIndex?: number;
    headerColor?: string;
    bodyColor?: string;
    bottomInsets?: number;
    onAnimationStateChanged: (state: AnimationState) => void;
};

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const MusicPlayer = ({
    tracks,
    initialIndex = 0,
    headerColor = '#ffffff',
    bodyColor = '#ffffff',
    ...rest
}: MusicPlayerProps) => {
    const [playerState, setPlayerState] = useState<AnimationState>('collapsed');
    const [index, setIndex] = useState<number>(initialIndex);
    const currentTrack = tracks[index];
    const scrollRef = useRef<FlatList>(null);

    // Determines whether there is a previous track based on the currently playing track.
    const canSkipBack = index > 0;

    // Determines whether there is a next track based on the currently playing track.
    const canSkipForward = index < tracks.length - 1

    // Animations
    const {
        maxOffsetY,
        minOffsetY,
        offsetY,
        sheetAnimation,
        playerAnimation,
        headerAnimation,
        headerAlbumAnimation,
        bodyHeaderAnimation,
        bodyAnimation,
        toolbarAnimation,
        bodyAlbumAnimation,
        tracksScrollAnimation,
        tracksScrollWrapperAnimations,
        collapse,
        expand,
        expandFully,
        gesture,
    } = usePlayerAnimation({
        headerColor,
        bodyColor,
        bottomInsets: rest.bottomInsets,
    });

    const {
        isPlaying,
        isShuffle,
        isRepeat,
        play,
        pause,
        toggleShuffle,
        toggleRepeat,
    } = usePlayerState();

    /** Returns the scroll offset based on the index */
    const getScrollOffsetByIndex = useCallback((index: number) => {
        return index * w(375);
    }, []);

    /** Returns the index based on the scroll offset */
    const getIndexByScrollOffset = useCallback((offset: number) => {
        const divided = offset / w(375);
        const decimal = divided - Math.floor(divided);
        const operator = decimal < 0.5 ? Math.floor : Math.round;

        return operator(divided);
    }, []);

    /** Moves to the previous track */
    const skipBack = () => {
        if (canSkipBack) {
            setIndex(i => {
                const nextIndex = i - 1;
                scrollRef.current?.scrollToOffset({
                    offset: getScrollOffsetByIndex(nextIndex),
                    animated: false,
                });

                return nextIndex;
            });
        }
    }

    /** Moves to the next track */
    const skipForward = () => {
        if (canSkipForward) {
            setIndex(i => {
                const nextIndex = i + 1;
                scrollRef.current?.scrollToOffset({
                    offset: getScrollOffsetByIndex(nextIndex),
                    animated: false,
                });

                return nextIndex;
            });
        }
    }

    const renderTrack = useCallback(({ item }: ListRenderItemInfo<Track>) => {
        return (
            <View style={{ width: w(375), alignItems: 'center' }}>
                <Image
                    source={{ uri: item.artwork }}
                    resizeMode='cover'
                    style={{ width: BODY_ALBUM_SIZE, height: BODY_ALBUM_SIZE }}
                />
            </View>
        );
    }, []);

    // Reaction: Set player state by offsetY
    useAnimatedReaction(
        () => offsetY,
        (offsetY) => {
            if (offsetY.value === minOffsetY) {
                return runOnJS(setPlayerState)('fullyExpanded');
            }

            if (offsetY.value === 0) {
                return runOnJS(setPlayerState)('expanded');
            }

            if (offsetY.value === maxOffsetY) {
                return runOnJS(setPlayerState)('collapsed');
            }
        },
    );

    // Effect: onAnimationStateChanged callback
    useEffect(() => {
        rest.onAnimationStateChanged(playerState);
    }, [playerState]);

    return (
        <GestureDetector gesture={gesture}>
            <View style={styles.absolute}>
                <Animated.View
                    entering={SlideInDown}
                    style={playerAnimation}
                >
                    {/* Body Header */}
                    <Animated.View style={
                        [
                            bodyHeaderAnimation,
                            {
                                ...headerStyles.container,
                                position: 'static',
                            }
                        ]
                    } />

                    {/* Body Header Background */}
                    < View style={{ backgroundColor: bodyColor, zIndex: 1 }}>
                        {/* Toolbar */}
                        <Toolbar
                            animation={toolbarAnimation}
                            onClosePress={collapse}
                            actions={(
                                <Ionicons
                                    name='ellipsis-vertical'
                                    size={sp(18)}
                                    color={colors.textA}
                                />
                            )}
                        />

                        {/* Tracks Scroll Wrapper */}
                        <Animated.View style={tracksScrollWrapperAnimations}>
                            {/* Animated Album */}
                            <Animated.Image
                                source={{ uri: currentTrack.artwork }}
                                resizeMode='cover'
                                style={[bodyAlbumAnimation, headerStyles.album]}
                            />

                            {/* Tracks Scroll View */}
                            <AnimatedFlatList
                                style={tracksScrollAnimation}
                                ref={scrollRef}
                                data={tracks}
                                renderItem={renderTrack}
                                keyExtractor={item => item['url']}
                                getItemLayout={(_, index) => ({
                                    length: w(375),
                                    offset: w(375) * index,
                                    index,
                                })}
                                initialScrollIndex={initialIndex}
                                scrollEventThrottle={16}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={e => setIndex(getIndexByScrollOffset(e.nativeEvent.contentOffset.x))}
                            />
                        </Animated.View>
                    </View>

                    {/* Body */}
                    <Animated.View style={[bodyAnimation, styles.body]}>
                        <View style={{ paddingHorizontal: BODY_ALBUM_PADDING_HORIZONTAL }}>
                            <Text style={styles.title}>{currentTrack.title}</Text>
                            <Text style={styles.artist}>{currentTrack.artist}</Text>
                        </View>

                        {/* Actions Container */}
                        <ScrollView
                            horizontal
                            style={{ flexGrow: 0 }}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.actionsContainer}
                        >
                            <Capsule backgroundColor={colors.background1}>
                                <Ionicons name='thumbs-up' color={colors.textA} />
                                <Text style={{ color: colors.textA }}>5588</Text>
                            </Capsule>

                            <Capsule backgroundColor={colors.background1}>
                                <Ionicons name='mail' color={colors.textA} />
                                <Text style={{ color: colors.textA }}>30</Text>
                            </Capsule>

                            <Capsule backgroundColor={colors.background1}>
                                <Ionicons name='add' color={colors.textA} />
                                <Text style={{ color: colors.textA }}>Save</Text>
                            </Capsule>

                            <Capsule backgroundColor={colors.background1}>
                                <Ionicons name='share-social' color={colors.textA} />
                                <Text style={{ color: colors.textA }}>Share</Text>
                            </Capsule>

                            <Capsule backgroundColor={colors.background1}>
                                <Ionicons name='save' color={colors.textA} />
                                <Text style={{ color: colors.textA }}>Download</Text>
                            </Capsule>

                            <Capsule backgroundColor={colors.background1}>
                                <Ionicons name='radio' color={colors.textA} />
                                <Text style={{ color: colors.textA }}>Radio</Text>
                            </Capsule>
                        </ScrollView>

                        {/* Progress Bar */}
                        <ProgressBar />

                        {/* Controller */}
                        <Controller
                            isPlaying={isPlaying}
                            isShuffle={isShuffle}
                            isRepeat={isRepeat}
                            canSkipBack={canSkipBack}
                            canSkipForward={canSkipForward}
                            onShufflePress={toggleShuffle}
                            onSkipBackPress={skipBack}
                            onPlayPress={play}
                            onPausePress={pause}
                            onSkipForwardPress={skipForward}
                            onRepeatPress={toggleRepeat}
                        />
                    </Animated.View>

                    {/* Header */}
                    <Header
                        track={currentTrack}
                        isPlaying={isPlaying}
                        animation={headerAnimation}
                        albumAnimation={headerAlbumAnimation}
                        backgroundColor={headerColor}
                        onHeaderPress={expand}
                        onPlayPress={play}
                        onPausePress={pause}
                    />

                    {/* Sheet */}
                    <Animated.View style={[styles.sheetTabContainer, sheetAnimation]}>
                        <Text style={styles.tab}>UP NEXT</Text>
                        <Text style={styles.tab}>LYRICS</Text>
                        <Text style={styles.tab}>RELATED</Text>
                    </Animated.View>
                </Animated.View>
            </View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    absolute: {
        position: 'absolute',
        width: w(375),
        height: h(812),
    },
    body: {
        paddingTop: h(24),
    },
    title: {
        fontSize: sp(24),
        fontWeight: 700,
        marginBottom: h(4),
        color: colors.textA,
    },
    artist: {
        fontSize: sp(16),
        fontWeight: 400,
        color: colors.textB,
    },
    actionsContainer: {
        alignItems: 'center',
        height: h(50),
        marginVertical: h(20),
        paddingHorizontal: w(12),
        gap: w(8),
    },
    sheetTabContainer: {
        position: 'absolute',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.background0,
        padding: w(20),
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    tab: {
        color: colors.textB,
        fontWeight: 600,
    }
});

export default MusicPlayer;