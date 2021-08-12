import {  DataTableRow,    DataTableCell,    DataTableColumnHeader,    Button,} from '@dhis2/ui'
import PropTypes from "prop-types";
import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
import IndicatorFacts from "./indicatorFacts";
import classes from './indicatorGroupRow.module.css'

function IndicatorGroupRow(props){

 function dispList(list){
     let items;
    if(isListFull){ 
        items= list.map((ind)=>{
            return(<li key={ind.id} className={classes.indicatorRowLink} onClick={()=>navigateToIndicatorHandler(ind.id)}> 
                     {ind.displayName}
                   </li>)
            }
            )
            
    }else{
     list=list.slice(0,3);  //just first three
     items= list.map((ind)=>{
          return(<li  key={ind.id} className={classes.indicatorRowLink} onClick={()=>navigateToIndicatorHandler(ind.id)}> 
                   {ind.displayName}
                 </li>)
      })
    }

    return items
 }


 function toogleIndicatorList(){
    isListFull ? setListFull(false) : setListFull(true)  
    dispList(props.indicators)
 }


 const [isListFull,setListFull]=useState(false)

    const history = useHistory();

    function navigateToIndicatorHandler(id){
       
        history.replace("/indicator/"+id);
    }


    return (<DataTableRow>
        <DataTableCell bordered>
           {props.no}
        </DataTableCell>
        <DataTableCell bordered>
           {props.name}
        </DataTableCell>
        <DataTableCell bordered>
           {props.code}
        </DataTableCell>
        <DataTableCell bordered>
            <ol>
              
                {dispList(props.indicators)}
               
            </ol>
           {props.indicators.length>3 ?
            <Button name="Basic button" onClick={toogleIndicatorList} value="default">
                {isListFull? 'show less':'show more'}
             </Button>: null}
        
        </DataTableCell>
    </DataTableRow>)
}

export default IndicatorGroupRow

IndicatorGroupRow.prototype={
    no:PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    code:PropTypes.string.isRequired,
    indicators:PropTypes.array.isRequired

}


