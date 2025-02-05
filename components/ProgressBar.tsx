import { StyleSheet, View } from 'react-native';
import { h } from '../styles/size';
import { colors } from '../styles/colors';
import { BODY_ALBUM_SIZE } from './values';

const ProgressBar = () => {
    return (
        <View style={styles.container} />
    );
}

const styles = StyleSheet.create({
    container: {
        height: h(2),
        width: BODY_ALBUM_SIZE,
        alignSelf: 'center',
        backgroundColor: colors.textB,
    }
});

export default ProgressBar;