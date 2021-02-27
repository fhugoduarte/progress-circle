function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  'worklet';
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

export function circlePath(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  'worklet';
  var start = polarToCartesian(x, y, radius, endAngle * 0.9999);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  var d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y];
  return d.join(' ');
}

export function clampPercentage(percent: number) {
  'worklet';
  return Math.min(100, Math.max(0, percent));
}