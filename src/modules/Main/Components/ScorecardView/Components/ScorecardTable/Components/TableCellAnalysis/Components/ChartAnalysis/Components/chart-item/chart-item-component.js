import Highcharts from 'highcharts';
import PropTypes from "prop-types";
import React,{useEffect} from 'react';
import { atom, useRecoilState, useRecoilValue, useSetRecoilState, } from 'recoil';
import { CHART_TYPES } from '../../../../../../../../../../../../core/constants/chart-types.constant';
import { DataState } from '../../../../state/data';
import { getCharObject } from '../../helper/get-chart-object.helper';
import './chart-item-component.css';




const chartTypesAtom = atom({
  key:'chartTypes-atom',
  default: CHART_TYPES
})                                                                                                                                                                                                                                      
const showOptionsAtom = atom({
  key:'chart-option-key',
  default:false
})

const chartUpdateAtom = atom({
  key:'chart-update-atom',
  default:{
    id:'',
    type:''
  }
})

const currentChartTypeAtom = atom({
  key:'current-chart-type',
  default:''
})

export default function ChartItemComponent({chartHeight}){
  const chartTypes =  useRecoilValue(chartTypesAtom)
  const showOptions =  useRecoilValue(showOptionsAtom)
  const setChartUpdate = useSetRecoilState(chartUpdateAtom);
  const [currentChartType,setCurrentChartType] = useRecoilState(currentChartTypeAtom);
  const data = useRecoilValue(DataState);

  let chart = '' ;
  console.log(showOptions);

  useEffect(() => {
     drawChart(data['_data'],{})
}, [data])


 
function drawChart(analyticsObject, chartConfiguration){
  if (chartConfiguration && analyticsObject) {
    //  const chartObject = getCharObject(
    //    analyticsObject,
    //    chartConfiguration
    //  );
  const  chartObject = {
      chart: {
        type: 'column',
        renderTo: 'atmospheric-composition'
      },
      title: {
        verticalAlign: 'middle',
        floating: true,
        text: 'Earth\'s Atmospheric Composition',
        style: {
          fontSize: '10px',
          fontWeight:'bold'
        }
      },
      plotOptions: {
        pie: {
          dataLabels: {
              format: '{point.name}: {point.percentage:.1f} %'
          },
          innerSize: '70%'
        }
      },
      series:  [{
        name: 'Gases',
        data: [
            {
              name: 'Argon',
              y: 0.2,
              color: '#3498db'
            },
            {
              name: 'Nitrogen',
              y: 0.4,
              color: '#9b59b6'
            },
            {
              name: 'Oxygen',
              y: 0.3,
              color: '#2ecc71'
            },
            {
              name: 'Trace Gases',
              y: 0.1,
              color: '#f1c40f'
            }
        ]
    },
  

  
  ]
  }

     if (chartObject) {
       setTimeout(() => {
        chart = Highcharts.chart("renderId",chartObject)
       }, 20);
     }
   }
 } 





  function updateChartType(chartType,event){
   event.stopPropagation();
   setCurrentChartType(chartType);

   drawChart(data['_data'],{
    //  ...this.chartConfiguration,
    // type:chartType
   })

   setChartUpdate({
     id:Math.random(),
     type:chartType.toUpperCase
   });
  }

return (
    <div className="chart-item-container">
  <div 
  id="renderId" className="chart-block" 
  style={{height:"calc("+chartHeight+"px-20px"}}
  ></div>

  <ul className="chart-type-list animated fadeInRight" 
//   [hidden]="!showOptions"
// hidden = {showOptions}
  >
    {
      chartTypes?.map((chartType,chartTypePosition)=>{
return <li
key ={"chart-type"+chartTypePosition}
 >
  <button 
onClick={(e)=>updateChartType(chartType.type,e)}
   title={chartType.description}
    className={currentChartType == chartType.type ? 'active-chart-type' :'active-chart-type'}
    >
    <img 
    src={chartType.icon} className="chart-option-icon" alt=""
    />
  </button>
</li>
      })
    }
    
  </ul>
</div>
)
}

ChartItemComponent.propTypes = {
  chartHeight: PropTypes.string.isRequired,
};