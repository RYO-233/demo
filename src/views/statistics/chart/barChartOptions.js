const dataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAAxklEQVQoU32Q2wqCQBCG/z20FSJlqT1E0E1U739Z4U3QQ6R2QqSydY1dSMxDczUw/8fMNwT/arawIK0xCC2gJEUhE9Kdnwu4Y9fMC0WQ5U8ku0sXQOFvPOSUG4DKHNE+BKDaAAJ7OYUQfXOKrvgWA8dMt03AWY5AuA0qcqiMofe44nRIv6f/AlryPXTKcCETXIN71bMC1CWzF5LgrJXbAApv5UNxZoZMSYTbSEvWv6g3ENjrCQQbtEk2gVKSK/Nvnt6qknXgA7yfTF+7pqFpAAAAAElFTkSuQmCC";
const PatternImgA = new Image()
PatternImgA.src = dataURL;
export const barOption = function (propData) {
  let xData = [];
  let yData = [];

  for (let key in propData) {
    xData.push(key);
    const val=(propData[key]==1)?100:(propData[key]* 100).toFixed(2) ||0
/*     yData.push((propData[key]* 100).toFixed(2) || 0);
    yData.push((1* 100).toFixed(2) || 0); */
    yData.push(val);
  }
 
  let len = Object.keys(propData).length || 0;
  let maxData = new Array(len).fill(100);
  console.log("linnnnnnnne");
  console.log(maxData);
  console.log(xData);
  console.log(yData);
  var option = {
    grid: {
      left: '5%',
      right: '20%',
      bottom: '5%',
      top: '2%',
      containLabel: false,
    },
    xAxis: [{
        show: false,
      },
      {
        show: false,

      },
    ],
    yAxis: [{
        show: false,
        data: yData,
      },

      {
        show: false,
        data: yData,
        offset: -50,
        position: 'right',
        axisLabel: {
          lineHeight: 30,
          verticalAlign: 'bottom',
          align: 'left',
          textStyle: {
            fontSize: 12,
            color: '#fff',
          },
          formatter: '{value}%',
        },

        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      {
        splitLine: 'none',
        axisTick: 'none',
        axisLine: 'none',
        data: yData,
        offset: 75,
        axisLabel: {
          show: true,
          verticalAlign: 'center',
          align: 'right',
          padding: [0, 26, 0, 0],
          textStyle: {
            color: '#fff',
            fontSize: '16',
          },
          formatter: function (value) {
            return '{x|' + value + '} {y|' + "%}"
          },
          rich: {
            y: {
              color: '#fff',
              fontSize: 12
            },
            x: {
              color: '#00F6FF',
              fontSize: 14,
              fontWeight: 600
            }
          }
        }
      },
    ],
    series: [

      {
        name: "外框",
        type: "bar",
        barGap: "-120%", //设置外框粗细
        data: maxData,
        barWidth: 25,
        itemStyle: {
          normal: {
            color: "none", //填充色
            barBorderColor: "none", //边框色
            barBorderWidth: 1, //边框宽度
            // barBorderRadius: 0, //圆角半径
            label: {
              //标签显示位置
              show: false,
              position: "insideLeft" //insideTop 或者横向的 insideLeft
            }
          }
        },
        z: 0
      },
      //水波纹
      {
        data: yData,
        type: 'bar',
        barGap: '-120%',
        xAxisIndex: 1,
        barWidth: 8, //统计条宽度
        label: {
          show: false,
          position: "top",
        },
        itemStyle: {
          barBorderRadius: [20, 20, 0, 0, 0],
          color: {
            image: PatternImgA,
            repeat: 'repeat',
            x: -6,
            y: 10,
            x2: -1,
            y2: 10
          }
        },
        z: 4,
      },
      {
        show: true,
        type: 'bar',
        barGap: '-120%',
        xAxisIndex: 1,
        barWidth: 8, //统计条宽度
        label: {
          show: false,
          position: 'insideTopRight', //每一条的数据位置
          padding: [-12, -22, 0, 0],

          formatter: () => {
            return '';
          },
          color: 'rgba(254, 173, 84, 1)',

          fontSize: 28,
        },
        itemStyle: {
          normal: {
            barBorderRadius: 8,
            color: function (params) {
              return {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [{
                    offset: 0,
                    color: '#00ffcd',
                  },
                  {
                    offset: 1,
                    color: '#0083ef',
                  },
                ],
              };
            },
          },
        },

        labelLine: {
          show: false,
        },
        z: 2,
        data: yData,
      },
      //进度标记（发光）
      {
        type: 'pictorialBar',
        zlevel: 2,
        symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAHCAYAAAArkDztAAAAh0lEQVQYV12OOwrCQBQA54GY3SgbAiJo621iIQiew9Yb2HoQSSHokQSxiFkkHw08WSGF1sMwI6iapMSWbwwgbkjjHbUkD01bIYsGrAHajjxSLjK567yIOZwNmwCWDce0YivTmy6KmP11zCqA2ZPTqGL3YwiQ9cZ/o+7IbWigap3H+tf3iv7qA2t2OH54SvGtAAAAAElFTkSuQmCC',
        symbolPosition: 'end',
        symbolOffset: [0, -2],
        symbolSize: ['15', '17.5'],
        data: yData,
      },
      {
        z: 1,
        name: 'label文字',
        show: true,
        type: 'bar',
        xAxisIndex: 1,
        barGap: '-120%',
        barWidth: 7, //统计条宽度
        itemStyle: {
          normal: {
            barBorderRadius: 7,
            color: 'rgba(13, 55, 78, 1)',
          },
        },
        label: {
          normal: {
            show: true,

            position: [0, -20],
            rich: {
              //富文本
              white: {
                //自定义颜色
                color: 'rgba(255,255,255,0.7)',
              },
            },
            formatter: function (data) {

              return '{white|' + xData[data.dataIndex] + '}';
            },
          },
        },
        data: maxData,
      },
    ],
  };
  return option
}
