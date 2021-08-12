
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


function DatasetsReportingRates(){

    return <div>
        <h3>Datasets (Reporting rates) in indicator</h3>
        <p>The following is the summary of the datasets (reporting rates) used in calculations:</p>
        <DataTable>
            <TableHead>
                <DataTableRow>
                    <DataTableColumnHeader bordered>
                    Dataset
                    </DataTableColumnHeader>
                    <DataTableColumnHeader bordered>
                    Description
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                    Timely Submission
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                    Expiry days
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                    Period type
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                    Assigned orgunits
                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                    Data elements
                    </DataTableColumnHeader>          
                    <DataTableColumnHeader>
                    Legends
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
                    
                    </DataTableCell>
                    <DataTableCell bordered>
                   
                    </DataTableCell  >
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

    </div>
}

export default DatasetsReportingRates