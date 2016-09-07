  (function(H) {
    var each = H.each,
    wrap = H.wrap, 
    merge = H.merge,
    defaultPlotOptions = H.getOptions().plotOptions;

    wrap(H.seriesTypes.scatter.prototype, 'drawPoints', function(p) {
      p.apply(this, [].slice.call(arguments, 1));
          generateShadows(this);
    });


// function responsible for adding shadow points.
    function generateShadows(series) {
      var chart = series.chart,
        shadowProjection = series.options.shadowProjection,
        shadowProjectionColor = series.options.shadowProjectionColor,
        renderer = chart.renderer,
        shadowProjectionRadius = series.options.shadowProjectionRadius,
        r,
        attrsShadow = {
          'stroke-width': 0,
          zIndex: 2
        };
      if (shadowProjection) {
        each(series.points, function(point) {
          attrsShadow.fill = shadowProjectionColor || point.color;
          r = shadowProjectionRadius || point.graphic.r;
          if (!point.shadowPoints) {
            point.shadowPoints = renderer.path([]).attr(attrsShadow).add();
          }
          point.shadowPoints.animate({
            d: generateShadowsForPoint(point, r)
          });
        });
      }
    };

    function generateShadowsForPoint (point, r) {
      var series = point.series,
          chart = series.chart,
          path = [],
          cos = Math.cos,
          sin = Math.sin,
          color,
          alpha = 2 * Math.PI / (r * 2),
          xAxis = chart.xAxis[0],
          yAxis = chart.yAxis[0],
          zAxis = chart.zAxis[0],
          zMax = zAxis.max,
          ry = yAxis.toValue(r) - yAxis.toValue(0),
          rz = zAxis.toValue(r) - zAxis.toValue(0),
          rx = xAxis.toValue(r) - xAxis.toValue(0),
          perspectivePoints, shadowPoint;




// x point

      shadowPoint = [];
        for (i = 0; i <= r * 2; i++) {
          shadowPoint.push({x: xAxis.toPixels(0), y: yAxis.toPixels(point.y + ry * cos(i * alpha)), z: zAxis.translate(point.z + rz * sin(i * alpha))});
        }

      perspectivePoints = H.perspective(shadowPoint, chart, false);
      ret = [];
      
      each(perspectivePoints, function(p) {
        p.plotX = p.x;
        p.plotY = p.y;
        p.plotZ = p.z;
      });
      path.push('M');
      path.push(perspectivePoints[0].x);
      path.push(perspectivePoints[0].y);
      each(perspectivePoints, function(p, i) {
        if (i > 0){
              ret = (H.seriesTypes.spline.prototype.getPointSpline(perspectivePoints, p, i));
            }
        each(ret, function (el){
          path.push(el);
        });
      });
        path.push('z');


// y point


      shadowPoint = [], perspectivePoints = [];
      for (i = 0; i <= r * 2; i++) {
          shadowPoint.push({x: xAxis.toPixels(point.x + rx * cos(i * alpha)), y: yAxis.toPixels(0), z: zAxis.translate(point.z + rz * sin(i * alpha))});
        }
      perspectivePoints = H.perspective(shadowPoint, chart, false);
      ret = [];
      
      each(perspectivePoints, function(p) {
        p.plotX = p.x;
        p.plotY = p.y;
        p.plotZ = p.z;
      });
      path.push('M');
      path.push(perspectivePoints[0].x);
      path.push(perspectivePoints[0].y);
      each(perspectivePoints, function(p, i) {
        if (i > 0){
              ret = (H.seriesTypes.spline.prototype.getPointSpline(perspectivePoints, p, i));
            }
        each(ret, function (el){
          path.push(el);
        });
      });
      path.push('z');



// z point


      shadowPoint = [];
      for (i = 0; i <= r * 2; i++) {
          shadowPoint.push({x: xAxis.toPixels(point.x + rx * sin(i * alpha)), y: yAxis.toPixels(point.y + ry * cos(i * alpha)), z: zAxis.translate(10)});
        }
      perspectivePoints = H.perspective(shadowPoint, chart, false);
      ret = [];
      
      each(perspectivePoints, function(p) {
        p.plotX = p.x;
        p.plotY = p.y;
        p.plotZ = p.z;
      });
      path.push('M');
      path.push(perspectivePoints[0].x);
      path.push(perspectivePoints[0].y);
      each(perspectivePoints, function(p, i) {
        if (i > 0){
              ret = (H.seriesTypes.spline.prototype.getPointSpline(perspectivePoints, p, i));
            }
        each(ret, function (el){
          path.push(el);
        });
      });
      path.push('z');
      
      return path;
    }

  })(Highcharts);

