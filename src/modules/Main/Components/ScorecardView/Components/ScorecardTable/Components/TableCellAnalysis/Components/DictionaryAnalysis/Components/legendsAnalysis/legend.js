import i18n from '@dhis2/d2-i18n'
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
} from '@dhis2/ui'
import PropTypes from "prop-types";
import React from 'react'
import LegendsAnalysis from "./legendsAnalysis";

function Legend(props){

    const legendSet=props.legendSet

 

    return (
        <li key={legendSet.id}>
             <p>
                  {legendSet.displayName} spread accross {legendSet.legends.length} classes of for analysis
          </p>
        
          <DataTable>
    <TableHead>
        <DataTableRow>
            <DataTableColumnHeader>
                {i18n.t('Class')}
            </DataTableColumnHeader>
            <DataTableColumnHeader>
                {i18n.t('Upper')}
            </DataTableColumnHeader>
            <DataTableColumnHeader>
                {i18n.t('Lower')}
            </DataTableColumnHeader>
            <DataTableColumnHeader>
                {i18n.t('Color')}
            </DataTableColumnHeader>
        </DataTableRow>
    </TableHead>
    <TableBody>
        
            {legendSet.legends.map((legend)=>{
                return <DataTableRow key={legend.id}>
                            <DataTableCell bordered>
                               {legend.displayName}
                            </DataTableCell >
                            <DataTableCell bordered>
                                {legend.endValue}
                            </DataTableCell>
                            <DataTableCell bordered>
                                {legend.startValue}
                            </DataTableCell>
                            <DataTableCell bordered>
                               <div style={{
                                   background: legend.color,
                                   width:200,
                                   height:50
                               }}>

                               </div>
                            </DataTableCell>
                        </DataTableRow>

            })}
            
        
        </TableBody>
        
    </DataTable>  
        </li>
    );
}


export default Legend

Legend.prototype={
    legendSet:PropTypes.object.isRequired
}