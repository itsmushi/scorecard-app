
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
import React from 'react'

function ProgramIndicatorIndicator(){

    return (<div>
       <h3> Program Indicators in indicator </h3>
        <p> The following is the summary of the program indicators used in calculations:</p>

        <DataTable>
            <TableHead>
                <DataTableRow>
                    <DataTableColumnHeader bordered>
                    Program Indicator
                    </DataTableColumnHeader>
                    <DataTableColumnHeader bordered>
                    Expression part 
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                    Filter
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                    Aggregation type
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                    Analytics type
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                    Period boundaries
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                    Legends
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                    Groups
                    </DataTableColumnHeader>          
                
                </DataTableRow>
            </TableHead>
            <TableBody>
                <DataTableRow>
                    <DataTableCell bordered>
                   
                    </DataTableCell  >
                    <DataTableCell bordered>
                       
                    </DataTableCell>
                    <DataTableCell bordered>
                    
                    </DataTableCell>
                    <DataTableCell bordered>
                   
                    </DataTableCell  >
                    <DataTableCell bordered>
                       
                    </DataTableCell>
                    <DataTableCell bordered>
                    
                    </DataTableCell>
                    <DataTableCell bordered>
                       
                       </DataTableCell>
                       <DataTableCell bordered>
                       
                       </DataTableCell>
                       
                
                </DataTableRow>
                <DataTableRow>
                    <DataTableCell bordered >
                   
                    </DataTableCell>
                    <DataTableCell bordered>
                   
                    </DataTableCell>
                    <DataTableCell bordered>
                    </DataTableCell>
                    <DataTableCell bordered >
                   
                   </DataTableCell>
                   <DataTableCell bordered>
                  
                   </DataTableCell>
                   <DataTableCell bordered>
                   </DataTableCell>
                   <DataTableCell bordered>
                  
                   </DataTableCell>
                   <DataTableCell bordered>
                       
                    </DataTableCell>
                       
                   
                </DataTableRow>
                
            </TableBody>
            
        </DataTable>  

    </div>)
}

export default ProgramIndicatorIndicator