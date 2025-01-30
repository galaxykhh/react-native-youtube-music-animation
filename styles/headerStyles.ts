import { StyleSheet } from 'react-native';

export const HEADER_HEIGHT = 74;

export const headerStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: HEADER_HEIGHT,
        columnGap: 12,
        paddingHorizontal: 8,
    },
    album: {
        width: 40,
        height: 40,
        borderRadius: 4,
    },
    titleWithArtistContainer: {
        flex: 1,
        justifyContent: 'center',
        rowGap: 4,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: 'black'
    },
    artist: {
        fontSize: 12,
        fontWeight: '400',
        color: 'grey'
    },
    controllerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 12,
    },
});