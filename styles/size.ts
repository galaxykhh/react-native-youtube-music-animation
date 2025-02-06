import { Dimensions, PixelRatio } from 'react-native';

export const DESIGN_WIDTH = 375;
export const DESIGN_HEIGHT = 812;

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scale = SCREEN_WIDTH / DESIGN_WIDTH;
const scaleVertical = SCREEN_HEIGHT / DESIGN_HEIGHT;

/*
* 기기의 해상도에 따라 width를 동적으로 계산
**/
export const w = (pixel: number) => {
    return PixelRatio.roundToNearestPixel(pixel * scale);
};

// 기기의 해상도에 따라 height를 동적으로 계산
export const h = (pixel: number) => {
    return PixelRatio.roundToNearestPixel(pixel * scaleVertical);
};

// 기기의 해상도에 따라 fontSize를 동적으로 계산
export const sp = (pixel: number) => {
    return w(pixel);
};