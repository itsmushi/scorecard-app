import { useDataQuery } from '@dhis2/app-runtime'
import {
    DataTable,    DataTableToolbar,    DataTableHead,    TableHead,    DataTableBody,    TableBody,    DataTableFoot,    DataTableRow,    DataTableCell,    DataTableColumnHeader,
 CircularLoader } from '@dhis2/ui'
import PropTypes from "prop-types";
import React, { useContext,useEffect } from "react";
import DataElementContext from '../../store/dataElementContext'

const query1={
    dataElement:{
      resource:"dataElements",
      id: ({idEle})=>idEle,
        params:{
          fields:["id","displayName"]
        }
    },
    categoryOptionCombo:{
      resource:"categoryOptionCombos",
      id: ({idComb})=>idComb,
      params:{
        fields:["id","displayName"]
      }
    }
  }
  const query2={
    dataElement:{
      resource:"dataElements",
      id: ({idEle})=>idEle,
        params:{
          fields:["id","displayName"]
        }
    }
}


function CalculationDetailRow(props){

    // {"id":arr[i],"val":"apiread value "}

const testArr=[]
//structure of dataElemet in store is 
    // [
    //     {
    //         "id":"dfds3ds.fdaf",
    //         "val":"value from api",
    //         "exprPart":"num/den",
    //     }
    // ]



    const formula=props.formula

    const loc=props.location


    const dataElements=useContext(DataElementContext)

    var wordDtEl=[]

    let allComplete=false
   
   

    function addDatalementToStore(dat){
        dataElements.addDataElement(dat);
    }

    function setCharAt(str,index,chr) {
        if(index > str.length-1) {return str;}
        return str.substring(0,index) + chr + str.substring(index+1);
    }


    function getFormulaSorces(formula){
        let ind1=0
        let ind2=0
      const arr=[]

        while(formula.search("#")>=0){//there is still a dataElement
            ind1=formula.indexOf("{")
            ind2=formula.indexOf("}")
            var datEl = formula.substring(ind1+1,ind2);  

            arr.push(datEl)

            formula= setCharAt(formula,ind1,"")         //remove {
              
            formula= setCharAt(formula,ind1-1,"")       //removes # 
           
            formula=setCharAt(formula,ind2-2,"")          //removes }
        }

        return arr
    }

    function getWordDataEle(arr){
       const arrWord=[]
       for(let i=0;i<arr.length;i++){
        arrWord.push({"id":arr[i],"val":getValueFromApi(arr[i]),"location":loc})
       }
       
       return arrWord;
    }

    function getFormulaInWordsFromFullSources(formula,arrOfSources){
        for( let i=0;i<arrOfSources.length;i++){
            if(formula.search(arrOfSources[i].id)>=0){
                formula=formula.replace(arrOfSources[i].id,arrOfSources[i].val);   
            }  
        }
        return formula
    }

    function isPureDataElement(str){
        if(str.indexOf(".")==-1){ //didnt find
            return true
        }else{
            return false;
        }  
    }

    function getValueFromApi(strEle){
       
        if(isPureDataElement(strEle)){
            //fetch value normally
           return getValueDataElementOnly(strEle)[0];
        }else{
            //break to array and just take first element
            let arr= strEle.split(".")
            arr= getValueDataElementOptionCombo(arr[0],arr[1])
            return arr[0]+" "+arr[1];
        }
       
    }

    
    function getValueDataElementOnly(idEle){
        const { loading, error, data } = useDataQuery(query2,{variables: {idEle}})
        if(loading){
            return <CircularLoader />
         }
     
         if(error){
          return <p> {error} </p> 
         }  
         return [data.dataElement.displayName]
    }

    function getValueDataElementOptionCombo(idEle,idComb){
        const { loading, error, data } = useDataQuery(query1,{variables: {idEle,idComb}})
        if(loading){
            return <CircularLoader />
         }
     
         if(error){
          return <p> {error} </p> 
         }  
        
         return [data.dataElement.displayName, data.categoryOptionCombo.displayName]

    }
    
    function getFinalWordFormula(formula){
        
         wordDtEl=getWordDataEle(getFormulaSorces(formula)) 
        
        wordDtEl.map((ele)=>{
            let complete=true
            if(typeof ele.val==='undefined'){
                complete=false
            }
            else{
                const tempArr=ele.val.split(" ")
                if(tempArr.includes("undefined")){
                    complete=false
                }  
             }
             if(complete){
                testArr.push(ele)
             }
             })
             if(testArr.length===wordDtEl.length){//all element are entered with values from api 
                allComplete=true
                
             }
      
         useEffect(()=>{ addDatalementToStore( testArr.map((el)=>{  return el  }));  },[allComplete])
        // str.replace(/blue/g, "red");
       return getFormulaInWordsFromFullSources(formula,wordDtEl).replace(/#/g,"") ;
    }
   
  
    return      <>
                <DataTableCell  bordered>
                    {getFinalWordFormula(formula)}
                </DataTableCell>
                <DataTableCell  bordered>
                     <ol>
                         {wordDtEl.map((el)=>{
                             return <li key={el.id}>{el.val}</li>
                         })}
                     </ol>
                </DataTableCell>
             </>
}

export default CalculationDetailRow;

CalculationDetailRow.prototype={
    id:PropTypes.string.isRequired,
    formula:PropTypes.string.isRequired,
    location:PropTypes.string.isRequired,

}
