import i18n from '@dhis2/d2-i18n'
import {
    DataTable,
    TableHead,
    TableBody,
    DataTableRow,
    DataTableColumnHeader,
} from '@dhis2/ui'
import React, { useContext } from "react";
import DataElementContext from '../../store/dataElementContext'
import Row from './row'

function DataElementSIndicator(){

    const dataElements=useContext(DataElementContext)
    

    return (<div>
       <h3>
           {i18n.t('Data elements in indicator')}</h3>
        <p>{i18n.t('The following is the summary of the data elements used in calculations:')} </p>
        
        <DataTable>
            <TableHead>
                <DataTableRow>
                    <DataTableColumnHeader bordered>
                        {i18n.t('Data Element')}

                    </DataTableColumnHeader>
                    <DataTableColumnHeader bordered>
                        {i18n.t('Expression part (Numerator/ Denominator)')}

                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        {i18n.t('Value Type')}

                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        {i18n.t('Zero Significance')}

                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        {i18n.t('Categories')}

                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        {i18n.t('Datasets/ Programs')}

                    </DataTableColumnHeader>
                    <DataTableColumnHeader>
                        {i18n.t('Groups')}

                    </DataTableColumnHeader>          
                
                </DataTableRow>
            </TableHead>
            <TableBody>
                {dataElements.dataElements.map((dtEle)=>{

                    return <Row key={dtEle.id} datEl={dtEle} />
                })}
            </TableBody>
            
        </DataTable>  


    </div>)
}

export default DataElementSIndicator