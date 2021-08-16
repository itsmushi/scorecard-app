import { useDataQuery } from '@dhis2/app-runtime'
import {
    DataTable,    DataTableToolbar,    DataTableHead,    TableHead,    DataTableBody,    TableBody,    DataTableFoot,    DataTableRow,    DataTableCell,    DataTableColumnHeader,
 CircularLoader } from '@dhis2/ui'
import CalculationDetailRow from './calculationDetailRow'

const query = {
    calculation:{
      resource:"indicators",
       id: ({id})=>id,
        params:{
          fields:["numerator","denominator"]
        }
    }
  }


function CalculationDetails({id}){

const {loading, error, data}   = useDataQuery(query, {variables: {id}})

if(loading){
    return <CircularLoader />
 }

 if(error){
    return <p> {error} </p> 
 }  

 const numDen=data.calculation


    return (<div>
       <h3> Calculation details</h3>
   <p> Below are expression computing numerator and denominator, and related sources </p>

   <DataTable>
    <TableHead>
        <DataTableRow>
            <DataTableColumnHeader>
                Expression
            </DataTableColumnHeader>
            <DataTableColumnHeader>
               Formula
            </DataTableColumnHeader>
            <DataTableColumnHeader>
             Sources
            </DataTableColumnHeader>
          
        </DataTableRow>
    </TableHead>
    <TableBody>
        <DataTableRow>
            <DataTableCell bordered>
               Numerator
            </DataTableCell  >
            <CalculationDetailRow formula={numDen.numerator} location="numerator" />
           
        </DataTableRow>
        <DataTableRow>
            <DataTableCell bordered >
               Denominator
            </DataTableCell>

            <CalculationDetailRow formula={numDen.denominator} location="denominator" />
           
        </DataTableRow>
        
    </TableBody>
    
</DataTable>  

    </div>)
}


export default CalculationDetails
