import React, { useEffect } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';

import * as constants from './constants';
import * as utils from './utils';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export interface ProgressCircleProps {
  progress: number;
  progressColor: string;
  backgroundColor: string;
  size?: number;
  backgroundWidth?: number;
  progressWidth?: number;
  padding?: number;
  gap?: number;
  duration?: number;
  children?: React.ReactNode;
}

export function ProgressCircle({
  progress,
  progressColor,
  backgroundColor,
  size = constants.DEFAULT_SIZE,
  padding = constants.DEFAULT_PADDING,
  backgroundWidth = constants.DEFAULT_BACKGROUND_WIDTH,
  progressWidth = constants.DEFAULT_PROGRESS_WIDTH,
  duration = constants.DEFAULT_DURATION,
  gap = constants.DEFAULT_PROGRESS_GAP,
  children,
} :ProgressCircleProps) {
  const progressAnimation = useSharedValue(0);

  const maxWidthCircle = Math.max(progressWidth, backgroundWidth);
  const sizeWithPadding = (size / 2) + (padding / 2);
  const radius = (size / 2) - (maxWidthCircle / 2) - (padding / 2);

  useEffect(() => {
    progressAnimation.value = withTiming(progress, {
      duration: duration,
      easing: Easing.linear,
    });
  }, [progress, duration]);

  const progressAnimatedProps = useAnimatedProps(() => {
    'worklet';
    const progressAngle = (constants.CIRCLE_DEGREES * utils.clampPercentage(progressAnimation.value)) / 100;
    const startAngle = 0;
    const endAngle = Math.min(progressAngle, constants.CIRCLE_DEGREES);

    const progressPath = utils.circlePath(sizeWithPadding, sizeWithPadding, radius, startAngle, endAngle);

    return {
      d: progressPath
    }
  });

  const backgroundProgressAnimatedProps = useAnimatedProps(() => {
    'worklet';
    const progressAngle = (constants.CIRCLE_DEGREES * utils.clampPercentage(progressAnimation.value)) / 100;
    const startAngle = Math.min(progressAngle + gap, constants.CIRCLE_DEGREES);
    const endAngle = constants.CIRCLE_DEGREES - gap;

    const backgroundPath = utils.circlePath(sizeWithPadding, sizeWithPadding, radius, startAngle, endAngle);

    return {
      d: backgroundPath
    }
  });

  const offset = size - maxWidthCircle * 2;

  const childrenContainerStyle = {
    position: 'absolute',
    left: maxWidthCircle + padding / 2,
    top: maxWidthCircle + padding / 2,
    width: offset,
    height: offset,
    borderRadius: (offset) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  } as StyleProp<ViewStyle>;

  return (
    <View style={{position: 'relative'}}>
      <Svg width={size + padding} height={size + padding}>
        <G originX={(size + padding) / 2} originY={(size + padding) / 2} rotation={0}>
            <AnimatedPath
              animatedProps={backgroundProgressAnimatedProps}
              fill="transparent"
              stroke={backgroundColor}
              strokeWidth={backgroundWidth}
              strokeLinecap="round"
            />

          {progress > 0 && (
            <AnimatedPath
              animatedProps={progressAnimatedProps}
              fill="transparent"
              stroke={progressColor}
              strokeWidth={progressWidth}
              strokeLinecap="round"
            />
          )}
        </G>
      </Svg>

      {children && (
        <View style={childrenContainerStyle}>
          {children}
        </View>
      )}
    </View>
  );
}
