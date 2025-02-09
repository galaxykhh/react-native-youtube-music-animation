import { StyleSheet, View } from 'react-native';
import { colors } from '../../styles/colors';

export type ProgressBarProps = {
    width: number;
    height: number;
    duration: number;
    buffered: number;
    position: number;
};

const ProgressBar = (props: ProgressBarProps) => {
    return (
        <View
            style={[styles.container, { width: props.width, height: props.height }]}
        >
            {/** Background */}
            <View
                style={[
                    styles.backgroundBar,
                    {
                        width: props.width,
                        height: props.height,
                    },
                ]}
            />

            {/** Buffered */}
            <View
                style={[
                    styles.bufferedBar,
                    {
                        width: ((props.buffered / props.duration) * props.width) || 0,
                        height: props.height,
                    }
                ]}
            />

            {/** Position (current progress) */}
            <View
                style={[
                    styles.positionBar,
                    {
                        width: ((props.position / props.duration) * props.width) || 0,
                        height: props.height,
                    }
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
    },
    backgroundBar: {
        position: 'absolute',
        backgroundColor: colors.background1,
    },
    bufferedBar: {
        position: 'absolute',
        backgroundColor: colors.textC,
    },
    positionBar: {
        position: 'absolute',
        backgroundColor: colors.textA,
    },
})

export default ProgressBar;