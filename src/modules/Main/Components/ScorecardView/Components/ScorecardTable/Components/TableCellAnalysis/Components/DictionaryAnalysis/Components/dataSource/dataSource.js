import i18n from '@dhis2/d2-i18n'
import { useDataQuery } from '@dhis2/app-runtime'
import { CircularLoader } from '@dhis2/ui'
import PropTypes from "prop-types";
import React from 'react'
   
const query = {
    sources:{
      resource:"indicators",
        //   id: "Uvn6LCg7dVU",
          id: ({id})=>id,
        params:{
          fields:["id","displayName","dataSets[id,displayName,timelyDays,periodType]"]
        }
    } 
  }
  
  
    function DataSource(props){

        const id=props.id

        const {loading, error, data}   = useDataQuery(query, {variables: {id}})

        if(loading){
          return ( <CircularLoader />)

       }
      
       if(error){

          return (<p> {error} </p>)
       }


        return (<div>
           <h3>{i18n.t('Data sources (Datasets/Programs)')} </h3>
           <p> {i18n.t('Indicator is captured from the following sources')}

                {/* issues of applicable routine dataSources */}
            </p>
            <h5>{i18n.t('Datasets')} </h5>
               
            <ul>
            {data.sources.dataSets.map((dataSet)=>{
                return <li key={dataSet.id}> <b>{dataSet.displayName}</b> {i18n.t('submitting')}  {dataSet.periodType} {i18n.t('after every')} {dataSet.timelyDays}</li>
            })}
            </ul>
            
            <h5>{i18n.t('Programs')} </h5>
        </div>)

    }

    export default DataSource;

DataSource.prototype={
    id:PropTypes.object
}