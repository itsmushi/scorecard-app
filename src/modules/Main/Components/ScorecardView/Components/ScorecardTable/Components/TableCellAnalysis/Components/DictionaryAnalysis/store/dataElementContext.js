import { createContext,useState } from "react";


const DataElementContext=createContext({
    dataElements:[],
    addDataElement:()=>{}
   
})

//structure of dataElemet in store is 
    // [
    //     {
    //         "id":"dfds3ds.fdaf",
    //         "val":"value from api",
    //         "exprPart":"num/den",
    //     }
    // ]

export function DataElementContextProvider(props){
    const[elements,setDataElements]=useState([])

    function addDataElementHandler(dataElement){
        setDataElements((prev)=>{
            return prev.concat(dataElement)
        })
    }

    function clearDataElementsHandler(){
        setDataElements([])
    }


    const context={
        dataElements:elements,
        addDataElement:addDataElementHandler,
        clearDataElement:clearDataElementsHandler,
    }

    return <DataElementContext.Provider value={context}>
        {props.children}
    </DataElementContext.Provider>
}

export default DataElementContext