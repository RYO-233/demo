import { getPie3D } from '@/utils/chart/pie';
export const pieOption=function(optionsData){
    let series = getPie3D(optionsData, 0.8, 240, 28, 26, 1);
    series.push({
      name: 'pie2d',
      type: 'pie',
      label: {
          opacity: 1,
          fontSize: 12,
          lineHeight: 20,
          formatter: (val) => {
            return '{x|' + val.name + '}\n'+'{y|' + val.value + "件}"
          },
          rich: {
            y: {
                color: '#00F6FF',
                fontSize: 12
            },
            x: {
                color: '#fff',
                fontSize: 14,
                fontWeight:600
            }
        }
      },
      labelLine: {
          length: 10,
          length2: 10,
      },
      startAngle: -120, //起始角度，支持范围[0, 360]。
      clockwise: false, //饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
      radius: ['15%', '50%'],
      center: ['45%', '35%'],
      data: optionsData,
      itemStyle: {
          opacity: 0,
      },
    });
    
    const  option = {
      legend: {
          tooltip: {
              show: true,
          },
          data:[],
          bottom: '10%',
          textStyle: {
              color: '#fff',
              fontSize: 12,
          },
      },
      tooltip: {
          formatter: (params) => {
              if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
                  let bfb = (
                      (option.series[params.seriesIndex].pieData.endRatio -
                          option.series[params.seriesIndex].pieData.startRatio) *
                      100
                  ).toFixed(2);
                  return (
                      `${params.seriesName}<br/>` +
                      `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>` +
                      `${bfb}%`
                  );
              }
          },
      },
    
     
      labelLine: {
          show: true,
          lineStyle: {
              color: '#7BC0CB',
          },
      },
      label: {
          show: false,
         /*  color: '#00F6FF', */
          position: 'outside',
          formatter: '{b} \n{c} 件',
      },
      xAxis3D: {
          min: -1,
          max: 1,
      },
      yAxis3D: {
          min: -1,
          max: 1,
      },
      zAxis3D: {
          min: -1,
          max: 1,
      },
      grid3D: {
          show: false,
          left:'-5%',
          top:'-15%',
          boxHeight: 18, // 三维笛卡尔坐标系在三维场景中的高度
          viewControl: {
              alpha: 30,
              beta: 120,
              distance: 400, //调整视角到主体的距离，类似调整zoom
              rotateSensitivity: 0, // 设置为0无法旋转
              zoomSensitivity: 0, // 设置为0无法缩放
              panSensitivity: 0, // 设置为0无法平移
              autoRotate: false, // 自动旋转
          },
      },
      series: series,
    };
    return option;
}
