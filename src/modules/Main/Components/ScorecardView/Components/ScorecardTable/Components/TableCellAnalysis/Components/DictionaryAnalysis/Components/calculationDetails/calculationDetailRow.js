import {CircularLoader, DataTableCell,} from '@dhis2/ui'
import {useDataEngine, useDataQuery} from '@dhis2/app-runtime'
import {useEffect, useState} from "react";
import {atom, useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";


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

export const dataElementsState = atom({
    key: 'dataElementsStoreDictionary', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
});



function CalculationDetailRow(props){

let testArr=[]
//structure of dataElemet in store is 
    // [
    //     {
    //         "id":"dfds3ds.fdaf",
    //         "val":"value from api",
    //         "exprPart":"num/den",
    //     }
    // ]

    //props
    const formula=props.formula
    const loc=props.location

    //variables
    let wordDtEl=[]
    const[dataElementsArray,setDataElementArray]=useState([])
    const engine = useDataEngine()
    const [currentValue,updateRecoilHandler]= useRecoilState(dataElementsState)

    useEffect(()=>{getWordDataEle(getFormulaSorces(formula)) },[])



    const generateKey = (pre) => {
        return `${ pre }_${ new Date().getTime() }`;
    }
    function setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substring(0,index) + chr + str.substring(index+1);
    }

    function getFormulaSorces(formula){
        let ind1=0
        let ind2=0
      let arr=[]

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

  async function getWordDataEle(arr){
        let allPromises=[];
        let i=0
        for(i=0;i<arr.length;i++){
            let proms=getValueFromApi(arr[i])
            allPromises.push(proms)
        }
        i=0
       await Promise.all(allPromises).then(value => {
           value.map((val)=>{ //We always return array just for uniformity
               if(val.length>1){ //array of two elements first element is dataElement second element of array is category option combo
                   wordDtEl.push({"id":arr[i],"val":val[0]+" "+val[1],"location":loc})
               }else{   //this is array of one element for data element that are just pure no category options
                   wordDtEl.push({"id":arr[i],"val":val[0],"location":loc})
               }
               ++i;
           })
           if(wordDtEl.length==arr.length){ //array is full so we reload to update UI
               setDataElementArray(wordDtEl)
               updateRecoilHandler( (prev)=>{
                  return  prev.concat(wordDtEl)
               } )

           }

        })

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
            return new Promise((resolve, reject) => {
               resolve(getValueDataElementOnly(strEle))
           })
        }else{
            //break to array and just take first element
            return new Promise(((resolve, reject) => {
                let arr = strEle.split(".")
                resolve(getValueDataElementOptionCombo(arr[0], arr[1]));
            }))
        }

    }

   async function getValueDataElementOnly(idEle){

        const data = await engine.query(query2,{variables: {idEle}})

         return [data?.dataElement?.displayName]
    }

   async function getValueDataElementOptionCombo(idEle,idComb){
        const data= await engine.query(query1,{variables: {idEle,idComb}})
         return [data?.dataElement?.displayName, data?.categoryOptionCombo?.displayName]

    }

    function getFinalWordFormula(formula){

        //
        // wordDtEl.map((ele)=>{
        //     let complete=true
        //     if(typeof ele.val==='undefined'){
        //         complete=false
        //     }
        //     else{
        //         let tempArr=ele.val.split(" ")
        //         if(tempArr.includes("undefined")){
        //             complete=false
        //         }
        //      }
        //      if(complete){
        //         testArr.push(ele)
        //      }
        //      })
        //      if(testArr.length===wordDtEl.length){//all element are entered with values from api
        //         allComplete=true
        //
        //      }
        //
        //  useEffect(()=>{ addDatalementToStore( testArr.map((el)=>{
        //      console.log("called useeEffect")
        //      return el  }));  },[allComplete])

       return getFormulaInWordsFromFullSources(formula,dataElementsArray).replace(/#/g,"")
    }

    return      <>


                <DataTableCell  bordered>
                    {getFinalWordFormula(formula)}
                </DataTableCell>
                <DataTableCell  bordered>
                     <ol>
                         {dataElementsArray.map((el)=>{
                             return <li key={generateKey(el.id)}>{el.val}</li>
                         })}
                     </ol>
                </DataTableCell>
             </>
}

export default CalculationDetailRow;