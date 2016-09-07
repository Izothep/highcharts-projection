(function (H) {
H.wrap(H.seriesTypes.spline.prototype, 'getPointSpline', function (proceed, points, point, i) {
            var smoothing = 1.5, // 1 means control points midway between points, 2 means 1/3 from the point, 3 is 1/4 etc
                denom = smoothing + 1,
                plotX = point.plotX,
                plotY = point.plotY,
                lastPoint = points[i - 1],
                nextPoint = points[i + 1],
                leftContX,
                leftContY,
                rightContX,
                rightContY,
                mathMin = Math.min,
                mathMax = Math.max,
                pick = H.pick,
                ret;
              //  console.log(point);
              //  console.log(points);
            // Find control points
            if (lastPoint && !lastPoint.isNull && nextPoint && !nextPoint.isNull) {
                var lastX = lastPoint.plotX,
                    lastY = lastPoint.plotY,
                    nextX = nextPoint.plotX,
                    nextY = nextPoint.plotY,
                    correction = 0;

                leftContX = (smoothing * plotX + lastX) / denom;
                leftContY = (smoothing * plotY + lastY) / denom;
                rightContX = (smoothing * plotX + nextX) / denom;
                rightContY = (smoothing * plotY + nextY) / denom;

                // Have the two control points make a straight line through main point
                if (rightContX !== leftContX) { // #5016, division by zero
                    correction = ((rightContY - leftContY) * (rightContX - plotX)) /
                        (rightContX - leftContX) + plotY - rightContY;
                }

                leftContY += correction;
                rightContY += correction;

                // to prevent false extremes, check that control points are between
                // neighbouring points' y values
                if (leftContY > lastY && leftContY > plotY) {
                    leftContY = mathMax(lastY, plotY);
                    rightContY = 2 * plotY - leftContY; // mirror of left control point
                } else if (leftContY < lastY && leftContY < plotY) {
                    leftContY = mathMin(lastY, plotY);
                    rightContY = 2 * plotY - leftContY;
                }
                if (rightContY > nextY && rightContY > plotY) {
                    rightContY = mathMax(nextY, plotY);
                    leftContY = 2 * plotY - rightContY;
                } else if (rightContY < nextY && rightContY < plotY) {
                    rightContY = mathMin(nextY, plotY);
                    leftContY = 2 * plotY - rightContY;
                }

                // record for drawing in next point
                point.rightContX = rightContX;
                point.rightContY = rightContY;

            
            }

            ret = [
                'C',
                pick(lastPoint.rightContX, lastPoint.plotX),
                pick(lastPoint.rightContY, lastPoint.plotY),
                pick(leftContX, plotX),
                pick(leftContY, plotY),
                plotX,
                plotY
            ];
            lastPoint.rightContX = lastPoint.rightContY = null; // reset for updating series later
            return ret;
});
}(Highcharts));
