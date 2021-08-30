import i18n from "@dhis2/d2-i18n";
import {DataTableCell, DataTableRow} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {useRecoilValue} from "recoil";
import {PeriodResolverState} from "../../../../../../../../../core/state/period";
import {ScorecardDataSourceState, ScorecardViewState} from "../../../../../../../../../core/state/scorecard";
import AverageCell from "./AverageCell";
import AverageDataContainer from "./AverageDataContainer";

export default function AverageDataSourceRow({orgUnits, overallAverage}) {
    const periods = useRecoilValue(PeriodResolverState)
    const dataHolders = useRecoilValue(ScorecardDataSourceState)
    const {averageColumn} = useRecoilValue(ScorecardViewState('options'))


    return (
        <DataTableRow bordered>
            <DataTableCell fixed left={"0"} width={"50px"}/>
            <DataTableCell fixed left={"50px"} className="scorecard-org-unit-cell">
                <b>{i18n.t('Average')}</b>
            </DataTableCell>
            {
                dataHolders?.map(({dataSources, id: holderId}) => (
                    periods?.map(({id}) => (
                        <AverageDataContainer orgUnits={orgUnits} key={`${holderId}-${id}-average-cell`}
                                              dataSources={dataSources?.map(({id}) => id)} period={id}/>
                    ))
                ))
            }
            {
                averageColumn &&
                <AverageCell bold value={overallAverage}/>
            }
        </DataTableRow>
    )

}

AverageDataSourceRow.propTypes = {
    orgUnits: PropTypes.array.isRequired,
    overallAverage: PropTypes.number.isRequired
};
