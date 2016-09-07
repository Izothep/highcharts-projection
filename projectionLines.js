  (function(H) {
    var each = H.each;
    H.wrap(H.seriesTypes.scatter.prototype, 'drawPoints', function(p) {
      p.apply(this, [].slice.call(arguments, 1));
      generateLines(this);
    });

    function generateLines(series) {
      var chart = series.chart,
        lineProjection = series.options.lineProjection,
        lineProjectionColor = series.options.lineProjectionColor,
        renderer = chart.renderer,
        attrs = {
          'stroke-width': 1,
          dashstyle: 'dash',
          zIndex: 3
        };
      if (lineProjection) {
        each(series.points, function(point) {
          attrs.stroke = lineProjectionColor || point.color
          if (!point.shadowLines) {
            point.shadowLines = renderer.path([]).attr(attrs).add();
          }
          point.shadowLines.animate({
            d: getLinePath(point)
          });
        });
      }
    }

    function getLinePath(point) {
      var series = point.series,
        chart = series.chart,
        starter = ['M', point.plotX + chart.plotLeft, point.plotY + chart.plotTop],
        path = [],
        i = 0,
        perspectivePoints,
        plotZ = series.zAxis.translate(point.z);

      perspectivePoints = H.perspective([{
        x: point.plotXold,
        y: point.plotYold,
        z: series.zAxis.translate(10) // get from extremes ?? 
      }, {
        x: point.plotXold,
        y: series.yAxis.toPixels(0, true),
        z: plotZ
      }, {
        x: series.xAxis.toPixels(0, true),
        y: point.plotYold,
        z: plotZ
      }], chart, true);
      
      for (; i < 3; i++) {
        path = path.concat(starter);
        path.push(
          'L',
          perspectivePoints[i].x + chart.plotLeft,
          perspectivePoints[i].y + chart.plotTop
        )
      }
      return path;
    }

  })(Highcharts);