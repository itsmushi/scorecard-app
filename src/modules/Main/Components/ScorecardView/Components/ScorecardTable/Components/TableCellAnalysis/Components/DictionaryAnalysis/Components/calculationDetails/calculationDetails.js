import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {    DataTable,    DataTableHead,    TableHead,    DataTableBody,    TableBody,    DataTableFoot,    DataTableRow,    DataTableCell,    DataTableColumnHeader,
 CircularLoader } from '@dhis2/ui'
import PropTypes from "prop-types";
import React from "react";
import CalculationDetailRow from './calculationDetailRow'



const query = {
    calculation:{
      resource:"indicators",
       id: ({idToUse})=>idToUse,
        params:{
          fields:["numerator","denominator"]
        }
    }
  }


function CalculationDetails(id){
    const idToUse=id.id

const {loading, error, data}   = useDataQuery(query, {variables: {idToUse}})

if(loading){
    return <CircularLoader />
 }

 if(error){
    return <p> {error} </p> 
 }  


 const numDen=data.calculation


    return (<div>
       <h3>{i18n.t('Calculation details')} </h3>
   <p>{i18n.t('Below are expression computing numerator and denominator, and related sources')}  </p>

   <DataTable>
    <TableHead>
        <DataTableRow>
            <DataTableColumnHeader>
                {i18n.t('Expression')}
            </DataTableColumnHeader>
            <DataTableColumnHeader>
               Formula
                {i18n.t('Formula')}

            </DataTableColumnHeader>
            <DataTableColumnHeader>

                {i18n.t('Sources')}

            </DataTableColumnHeader>
          
        </DataTableRow>
    </TableHead>
    <TableBody>
        <DataTableRow>
            <DataTableCell bordered>
                {i18n.t('Numerator')}

            </DataTableCell  >
            <CalculationDetailRow formula={numDen.numerator} location="numerator" />
           
        </DataTableRow>
        <DataTableRow>
            <DataTableCell bordered >
                {i18n.t('Denominator')}

            </DataTableCell>

            <CalculationDetailRow formula={numDen.denominator} location="denominator" />
           
        </DataTableRow>
        
    </TableBody>
    
</DataTable>  

    </div>)
}


export default CalculationDetails

CalculationDetails.prototype={
    id:PropTypes.string.isRequired
}
