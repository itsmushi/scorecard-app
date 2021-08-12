import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import CalculationDetails from "./Components/calculationDetails/calculationDetails";
import DataSource from "./Components/dataSource/dataSource";
import IndicatorFacts from "./Components/indicatorFacts/indicatorFacts";
import Introduction from "./Components/introduction/introduction";
import LegendsAnalysis from "./Components/legendsAnalysis/legendsAnalysis";
import {DataElementContextProvider} from "./store/dataElementContext";


export default function DictionaryAnalysis({dimensions}) {
    const {dataSources} = dimensions ?? {}

    // console.log(dataSources)   //This is an array of selected indicators check the ScorecardIndicator model to know its properties

    const id=dataSources[0].id


    return (
        <div className='column align-items-center center' style={{minHeight: 500}}><h3>{i18n.t('Dictionary analysis')}</h3>

            <div style={{display:"flex",flexDirection:"column"}}>
                <DataElementContextProvider>
                    <Introduction id={id} />

                    <DataSource id={id} />

                    <IndicatorFacts id={id} />

                    <LegendsAnalysis id={id} />

                    <CalculationDetails id={id} />

                    {/*<DataElementSIndicator />*/}

                    {/*<ProgramIndicatorIndicator    />*/}


                    {/*<DatasetsReportingRates />*/}

                    {/*<CompletenessDataSources />*/}
                </DataElementContextProvider>


            </div>

        </div> //TODO: @james
    )
}

DictionaryAnalysis.propTypes = {
    dimensions: PropTypes.array.isRequired
};

