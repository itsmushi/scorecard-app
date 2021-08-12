
import i18n from '@dhis2/d2-i18n'
import { useDataQuery } from '@dhis2/app-runtime'
import {
    DataTable,
    DataTableToolbar,
    DataTableHead,
    TableHead,
    DataTableBody,
    TableBody,
    DataTableFoot,
    DataTableRow,
    DataTableCell,
    DataTableColumnHeader,
 CircularLoader } from '@dhis2/ui'
import PropTypes from "prop-types";
import React from 'react'
import IndicatorGroupRow from './indicatorGroupRow'

const query =  {
    indicatorGroups:{
      resource:"indicators",
      id: ({id})=>id,
        params:{
          fields:["indicatorGroups[id,displayName,indicators[id,displayName]]"]
        }
    }
  }

function IndicatorFacts({id}){
     
    const {loading, error, data}   = useDataQuery(query, {variables: {id}})

    if(loading){
        return <CircularLoader />
     }
 
     if(error){
        return <p> {error} </p> 
     }  


     if(data.indicatorGroups.indicatorGroups){
         return <p>{i18n.t('No indicator facts')} </p>
     }
 
     let count=0
    return (<div>
        <h3> {i18n.t('Indicator facts')} </h3>

        <p>{i18n.t('Belongs to the following groups of indicators')} </p>

        <div>


        <DataTable>
    <TableHead>
        <DataTableRow>
            <DataTableColumnHeader>
               #
            </DataTableColumnHeader>
            <DataTableColumnHeader>
                {i18n.t('Name')}
            </DataTableColumnHeader>
            <DataTableColumnHeader>
                {i18n.t('Code')}
            </DataTableColumnHeader>
            <DataTableColumnHeader>
                {i18n.t('Indicators')}
            </DataTableColumnHeader>
        </DataTableRow>
    </TableHead>
    <TableBody>
        {data.indicatorGroups.indicatorGroups.map((group)=>{
            count++
            return  (<IndicatorGroupRow key={group.id} no={count} name={group.displayName} code={group.id} indicators={group.indicators} />)
        })}
        
        
    </TableBody>
    
</DataTable>
        </div>

    </div>)
}

export default IndicatorFacts


IndicatorFacts.prototype={
    id:PropTypes.object
}