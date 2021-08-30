export function getTableWidthWithDataGroups(periods = [], dataGroups = [], averageColumn) {
    return getColSpanDataGroups(periods, dataGroups, averageColumn) * 102 + 305;      //350 accounts for the static orgUnit and expand icon. 2px is for the border
}

export function getColSpanDataGroups(periods = [], dataGroups = [], averageColumn) {
    const noOfPeriods = periods?.length || 1;
    const noOfDataSources = dataGroups.reduce((prevValue, currentValue) => prevValue + currentValue.dataHolders?.length, 0)
    return (noOfDataSources * noOfPeriods) + (averageColumn ? 1 : 0);      //350 accounts for the static orgUnit and expand icon. 2px is for the border
}

export function getTableWidthWithOrgUnit(periods, orgUnits, averageColumn) {
    return getColSpanWithOrgUnit(periods, orgUnits, averageColumn) * 102 + 305;
}

export function getColSpanWithOrgUnit(periods, orgUnits, averageColumn) {
    const noOfPeriods = periods?.length || 1;
    const noOfOrgUnits = orgUnits.length || 1;
    return (noOfOrgUnits * noOfPeriods) + (averageColumn ? 1 : 0);
}
