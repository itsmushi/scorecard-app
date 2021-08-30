import * as _ from 'lodash';
export function getChartPaneOptions(chartType) {
  let paneOptions = {};

  switch (chartType) {
    case 'radar':
      paneOptions = _.assign(
        {},
        {
          size: '80%'
        }
      );
      break;
    default:
      paneOptions = _.assign(
        {},
        {
          center: ['50%', '85%'],
          size: '140%',
          startAngle: -90,
          endAngle: 90,
          background: {
            backgroundColor: '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
          }
        }
      );
      break;
  }
  return paneOptions;
}
