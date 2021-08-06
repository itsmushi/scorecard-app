import {Period} from "@iapps/period-utilities";
import {find, get as _get} from "lodash";

export function getTableWidth(periods = [], dataGroups = []) {
    const noOfPeriods = periods?.length || 1;
    const noOfDataSources = dataGroups.reduce((prevValue, currentValue) => prevValue + currentValue.dataHolders?.length, 0)
    return (noOfDataSources * noOfPeriods * 152) + 350;      //350 accounts for the static orgUnit and expand icon. 2px is for the border
}


export function getCurrentAndPreviousData(analyticsData, {dataSources=[], period, orgUnit}) {

    const allData = []
    for (const dataSource of dataSources) {
        const currentData = find(analyticsData, ({dx, pe, ou}) => {
            return ou === orgUnit && dx === dataSource && pe === period
        })
        const previousData = find(analyticsData, ({dx, pe, ou}) => {
            const previousPeriod = new Period().getById(period).lastPeriod;
            return ou === orgUnit && dx === dataSource && pe === previousPeriod?.id
        })
        allData.push({
            current: _get(currentData, ['value']),
            previous: _get(previousData, ['value'])
        })

    }
    return allData;
}
