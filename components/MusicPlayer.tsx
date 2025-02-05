import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Animated, { useDerivedValue } from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import Header, { styles as headerStyles } from './Header';
import Capsule from './Capsule';
import Controller from './Controller';
import Toolbar from './Toolbar';
import { BODY_ALBUM_PADDING_HORIZONTAL } from './values';
import { colors } from '../styles/colors';
import { h, sp, w } from '../styles/size';
import ProgressBar from './ProgressBar';
import { usePlayerAnimation } from './usePlayerAnimation';

type PlayerState =
    | 'collapsed'
    | 'expanded'
    | 'fullyExpanded';

export type MusicCover = {
    thumbnail: string;
    main: string;
};

export type Music = {
    title: string;
    artist: string;
    cover: MusicCover;
}

export type MusicPlayerProps = {
    music: Music
    headerColor?: string;
    bodyColor?: string;
    bottomInsets?: number;
};

const MusicPlayer = ({
    music,
    headerColor = '#ffffff',
    bodyColor = '#ffffff',
    ...rest
}: MusicPlayerProps) => {

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
        bodyContentAnimation,
        toolbarAnimation,
        bodyAlbumAnimation,
        collapse,
        expand,
        expandFully,
        gesture,
    } = usePlayerAnimation({
        headerColor,
        bodyColor,
        bottomInsets: rest.bottomInsets,
    });

    // State
    const playerState = useDerivedValue<PlayerState>(() => {
        const isFullyExpanded = offsetY.value === minOffsetY;

        if (isFullyExpanded) {
            return 'fullyExpanded';
        }

        const isExpanded = offsetY.value === 0;

        if (isExpanded) {
            return 'expanded'
        }

        return 'collapsed';
    });

    return (
        <>
            <GestureDetector gesture={gesture}>
                <Animated.View
                    style={
                        [
                            playerAnimation,
                            {
                                ...styles.container,
                            }
                        ]
                    }>
                    {/* Body Header */}
                    <Animated.View style={
                        [
                            bodyHeaderAnimation,
                            {
                                ...headerStyles.container,
                                position: 'static'
                            }
                        ]
                    } />

                    {/* Body Header Background */}
                    <View style={{ backgroundColor: bodyColor, zIndex: 1 }}>

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

                        {/* Body Album */}
                        <Animated.Image
                            source={{ uri: music.cover.main }}
                            resizeMode='cover'
                            style={[
                                bodyAlbumAnimation,
                                {
                                    ...headerStyles.album,
                                }]}
                        />
                    </View>

                    {/* Body */}
                    <View
                        style={[
                            {
                                ...bodyStyles.container,
                                backgroundColor: bodyColor,
                                paddingTop: h(20),
                            }
                        ]}>
                        <Animated.View style={bodyContentAnimation}>
                            <View style={{ paddingHorizontal: BODY_ALBUM_PADDING_HORIZONTAL }}>
                                <Text style={bodyStyles.title}>{music.title}</Text>
                                <Text style={bodyStyles.artist}>{music.artist}</Text>
                            </View>

                            {/* Actions Container */}
                            <ScrollView
                                horizontal
                                style={{ flexGrow: 0 }}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={bodyStyles.actionsContainer}
                            >
                                <Capsule>
                                    <Ionicons name='thumbs-up' color={colors.textA} />
                                    <Text style={{ color: colors.textA }}>5588</Text>
                                </Capsule>

                                <Capsule>
                                    <Ionicons name='mail' color={colors.textA} />
                                    <Text style={{ color: colors.textA }}>30</Text>
                                </Capsule>

                                <Capsule>
                                    <Ionicons name='add' color={colors.textA} />
                                    <Text style={{ color: colors.textA }}>Save</Text>
                                </Capsule>

                                <Capsule>
                                    <Ionicons name='share-social' color={colors.textA} />
                                    <Text style={{ color: colors.textA }}>Share</Text>
                                </Capsule>

                                <Capsule>
                                    <Ionicons name='save' color={colors.textA} />
                                    <Text style={{ color: colors.textA }}>Download</Text>
                                </Capsule>

                                <Capsule>
                                    <Ionicons name='radio' color={colors.textA} />
                                    <Text style={{ color: colors.textA }}>Radio</Text>
                                </Capsule>
                            </ScrollView>

                            {/* Progress Bar */}
                            <ProgressBar />

                            {/* Controller */}
                            <Controller
                                onShufflePress={() => { }}
                                onSkipBackPress={() => { }}
                                onPlayPress={() => { }}
                                onSkipForwardPress={() => { }}
                                onRepeatPress={() => { }}
                            />
                        </Animated.View>

                        {/* Sheet */}
                        <Animated.View style={[bodyStyles.sheetTabContainer, sheetAnimation]}>
                            <Text style={bodyStyles.tab}>UP NEXT</Text>
                            <Text style={bodyStyles.tab}>LYRICS</Text>
                            <Text style={bodyStyles.tab}>RELATED</Text>
                        </Animated.View>
                    </View>

                    {/* Header */}
                    <Header
                        onPress={expand}
                        music={music}
                        animation={headerAnimation}
                        albumAnimation={headerAlbumAnimation}
                        backgroundColor={headerColor}
                    />
                </Animated.View>
            </GestureDetector>
        </>
    );
}

const bodyStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
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
        flexGrow: 0,
        alignItems: 'center',
        alignSelf: 'stretch',
        height: h(50),
        marginVertical: h(20),
        paddingHorizontal: w(12),
        gap: w(8),
        backgroundColor: colors.background0,
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        bottom: 0,
    },
});

export default MusicPlayer;