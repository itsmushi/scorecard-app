import {CircularLoader, DataTableCell, DataTableRow, LinearLoader} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, {useEffect, useState} from 'react'
import {useRecoilValue} from "recoil";
import ScorecardDataEngine from "../../../../../../../core/models/scorecardData";
import {ScorecardTableConfigState} from "../../../../../../../core/state/scorecard";
import useMediaQuery from "../../../../../../../shared/hooks/useMediaQuery";

export default function TableLoader() {
    const {width: screenWidth} = useMediaQuery();
    return (
        <DataTableRow>
            <DataTableCell width={`${screenWidth}px`} align='center'>
                <div className='row center align-items-center' style={{height: 400, width: '100%'}}>
                    <CircularLoader small/>
                </div>
            </DataTableCell>
        </DataTableRow>
    )
}


export function TableLinearLoader({dataEngine, orgUnits}) {
    const {width: screenWidth} = useMediaQuery();
    const {colSpan} = useRecoilValue(ScorecardTableConfigState(orgUnits))
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const subscription = dataEngine.getProgress().subscribe(setProgress)
        return () => {
            subscription.unsubscribe()
        };
    }, [orgUnits, dataEngine]);

    return (
        (progress !== 100 && progress !== 0) &&
        <DataTableRow>
            <td colSpan={colSpan}>
                <LinearLoader width={`${screenWidth}px`} amount={progress} margin={0}/>
            </td>
        </DataTableRow>
    )
}


TableLinearLoader.propTypes = {
    dataEngine: PropTypes.instanceOf(ScorecardDataEngine).isRequired,
    orgUnits: PropTypes.array.isRequired
};
