import i18n from '@dhis2/d2-i18n'
import { useDataQuery } from '@dhis2/app-runtime'
import { CircularLoader } from '@dhis2/ui'
import PropTypes from "prop-types";
import Introduction from "../introduction/introduction";
import Legend from './legend'

const query =    {
  legendAnalysis:{
    resource:"indicators",
    // "id": "ulgL07PF8rq",
    id: ({id})=>id,
      params:{
        fields:["id","displayName","legendSets[id,displayName,legends[id,displayName,startValue,endValue,color]]"]
      }
  } 
}

function LegendsAnalysis({id}){

      const {loading, error, data}   = useDataQuery(query, {variables: {id}})

      if(loading){
        return <CircularLoader />
     }
 
     if(error){
        return <p> {error} </p> 
     }  
   
     if(data.legendAnalysis.legendSets.length===0){
       return <><p>{i18n.t('No legends')} </p></> //no legends sets
     }

     const legendSet=data.legendAnalysis.legendSets

     return (
       <div>
          <h3>{i18n.t('Legends for analysis')}
              </h3>
          <p>{i18n.t('Uses')}
               {legendSet.length} {i18n.t('legends for for analysis, spread accross multiple cut-off points of interest, existing legends are:')}
          </p>
          <ul>
            {legendSet.map((legendSet)=>{
              return <Legend key={legendSet.id} legendSet={legendSet} />
            })}
          </ul>
         
      </div>
     )
}

export default LegendsAnalysis;


LegendsAnalysis.prototype={
    id:PropTypes.string.isRequired
}
