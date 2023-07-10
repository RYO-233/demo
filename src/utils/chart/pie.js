// 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
export const getParametricEquation=function(startRatio, endRatio, isSelected, isHovered, k, h) {
  // 计算
  const midRatio = (startRatio + endRatio) / 2;
  const startRadian = startRatio * Math.PI * 2;
  const endRadian = endRatio * Math.PI * 2;
  const midRadian = midRatio * Math.PI * 2;
  // 如果只有一个扇形，则不实现选中效果。
  if (startRatio === 0 && endRatio === 1) {
      isSelected = false;
  }
  // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
  k = 1;
  // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
  const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
  const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
  // 计算高亮效果的放大比例（未高亮，则比例为 1）
  const hoverRate = isHovered ? 1.05 : 1;
  // 返回曲面参数方程
  return {
      u: {
          min: -Math.PI,
          max: Math.PI * 3,
          step: Math.PI / 32,
      },
      v: {
          min: 0,
          max: Math.PI * 2,
          step: Math.PI / 20,
      },
      x: function (u, v) {
          if (u < startRadian) {
              return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
          }
          if (u > endRadian) {
              return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
          }
          return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
      },
      y: function (u, v) {
          if (u < startRadian) {
              return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
          }
          if (u > endRadian) {
              return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
          }
          return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
      },
      z: function (u, v) {
          if (u < -Math.PI * 0.5) {
              return Math.sin(u);
          }
          if (u > Math.PI * 2.5) {
              return Math.sin(u) * h * 0.1;
          }
          return Math.sin(v) > 0 ? 1 * h * 0.1 : -1;
      },
  };
}

/**
* 绘制3d图
* @param pieData 总数据
* @param internalDiameterRatio:透明的空心占比
* @param distance 视角到主体的距离
* @param alpha 旋转角度
* @param pieHeight 立体的高度
* @param opacity 饼或者环的透明度
*/
export const  getPie3D=function(pieData, internalDiameterRatio, distance, alpha, pieHeight, opacity = 1) {
  const series = [];
  let sumValue = 0;
  let startValue = 0;
  let endValue = 0;
  const legendData = [];
  const k =
      typeof internalDiameterRatio !== 'undefined'
          ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
          : 1 / 3;
  // 为每一个饼图数据，生成一个 series-surface 配置
  for (let i = 0; i < pieData.length; i += 1) {
      sumValue += pieData[i].value;
      const seriesItem = {
          name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
          type: 'surface',
          parametric: true,
          wireframe: {
              show: false,
          },
          pieData: pieData[i],
          pieStatus: {
              selected: false,
              hovered: false,
              k: k,
          },
      };
      if (typeof pieData[i].itemStyle !== 'undefined') {
          const itemStyle = {};
          if (typeof pieData[i].itemStyle.color !== 'undefined') {
              itemStyle.color = pieData[i].itemStyle.color;
          }
          if (typeof pieData[i].itemStyle.opacity !== 'undefined') {
              itemStyle.opacity = pieData[i].itemStyle.opacity;
          }
          seriesItem.itemStyle = itemStyle;
      }
      series.push(seriesItem);
  }
  // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
  // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
  console.log("总和",sumValue);
  for (let i = 0; i < series.length; i += 1) {
      endValue = startValue + series[i].pieData.value;
      series[i].pieData.startRatio = startValue / sumValue;
      series[i].pieData.endRatio = endValue / sumValue;
/*       console.log(series[i].pieData.startRatio,
          series[i].pieData.endRatio,
          false,  
          false,
          k,
          series[i].pieData.value) */
      series[i].parametricEquation = getParametricEquation(
          series[i].pieData.startRatio,
          series[i].pieData.endRatio,
          false,
          false,
          k,
          series[i].pieData.value
      );
      startValue = endValue;
      legendData.push(series[i].name);
  
  }

  return series;
}





  