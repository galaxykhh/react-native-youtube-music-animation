import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { h, sp, w } from './size';

export const HEADER_HEIGHT = h(74);

export const headerStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: HEADER_HEIGHT,
        gap: w(12),
        paddingHorizontal: w(8),
    },
    album: {
        width: w(40),
        height: w(40),
        borderRadius: 4,
    },
    titleWithArtistContainer: {
        flex: 1,
        justifyContent: 'center',
        rowGap: 4,
    },
    title: {
        fontSize: sp(14),
        fontWeight: '700',
        color: colors.textA,
    },
    artist: {
        fontSize: sp(12),
        fontWeight: '400',
        color: colors.textB,
    },
    controllerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: w(12),
        paddingRight: w(12),
    },
});