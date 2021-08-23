import {dataSourceTypes, dataTypes} from "../../../Utils/Models";
import IndicatorPage from "../../Indicator/IndicatorPage";
import DataElementPage from "../../DataElement/DataElementPage";
import {useRecoilValue} from "recoil";
import {dataSourceStateDictionary} from "../../../Store";


export default function DataSourceSelector(props){

    const{id,type}=useRecoilValue(dataSourceStateDictionary);

    if(type!==dataTypes.UNDEFINED){
        if(type===dataSourceTypes.INDICATOR){
            return  <IndicatorPage id={id} />
        }
        if(type===dataSourceTypes.DATA_ELEMENT){
            return <DataElementPage  id={id} />
        }
    }

    return <></>


}